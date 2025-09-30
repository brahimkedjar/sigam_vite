import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from './audit-log.service';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

interface PrismaModelInfo {
  name: string;
  primaryKey: string;
  fields: string[];
}

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);
  private readonly excludedRoutes = ['/audit-logs/log'];
  private prismaModels: Map<string, PrismaModelInfo> = new Map();
  private modelCacheInitialized = false;
  private readonly excludedPaths = [
    '/auth/refresh',
    '/auth/login',
    '/_next/',
    '/favicon.ico',
    '/health',
    '/audit-logs/revert'
  ];

  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly prisma: PrismaService,
    private reflector: Reflector,
  ) {
    this.initializeModelCache().catch(error => {
      this.logger.error('Failed to initialize model cache', error);
    });
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
  const request = context.switchToHttp().getRequest();
  const { method, originalUrl, body, params } = request;

  if (this.shouldSkipLogging(request)) {
    return next.handle();
  }

  if (this.excludedRoutes.includes(originalUrl) || (method === 'GET' && !originalUrl.includes('/export'))) {
    return next.handle();
  }

  if (!this.modelCacheInitialized) {
    await this.initializeModelCache();
  }

  const entityType = this.getEntityType(context, originalUrl);
  const entityId = params.id ? Number(params.id) : body?.id ? Number(body.id) : undefined;
  
  let previousState: Record<string, any> | null = null;
  let changes: Record<string, { old?: any; new: any }> = {};

  if (['PUT', 'PATCH', 'DELETE'].includes(method) && entityId) {
    try {
      const modelName = await this.getPrismaModelName(entityType);
      if (modelName) {
        previousState = await this.getPreviousState(modelName, entityId);
        
        // Don't throw error if previous state is null, just log and continue
        if (!previousState) {
          this.logger.warn(`Previous state not found for ${entityType} with ID ${entityId}`);
        } else {
          request['_oldData'] = previousState;

          if (method === 'DELETE') {
            Object.keys(previousState).forEach(key => {
              if (!this.isSensitiveField(key)) {
                changes[key] = { old: previousState![key], new: null };
              }
            });
          } else {
            changes = this.getChanges(body, previousState, method) || {};
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error getting previous state: ${error.message}`);
      // Don't rethrow the error, just continue without previous state
    }
  }

  if (method === 'POST') {
    changes = this.getChanges(body, null, method) || {};
  }

  return next.handle().pipe(
    tap({
      next: async (response) => {
        const finalEntityId = entityId || response?.id || 
                            (response?.data?.id ? Number(response.data.id) : undefined);

        if (['PUT', 'PATCH'].includes(method) && request['_oldData']) {
          const updatedChanges = this.getChanges(body, request['_oldData'], method);
          if (updatedChanges) {
            changes = updatedChanges;
          }
        }

        if (method === 'POST' && response) {
          changes = this.getCreateChanges(body, response);
        }

        await this.logAction({
          request,
          action: this.getAction(method),
          entityType,
          entityId: finalEntityId,
          changes,
          previousState,
          status: 'SUCCESS',
          response
        });
      },
      error: async (error) => {
        await this.logAction({
          request,
          action: this.getAction(method),
          entityType,
          entityId,
          changes,
          previousState,
          status: 'FAILURE',
          error
        });
      },
    }),
  );
}

  private async initializeModelCache(): Promise<void> {
  try {
    const prismaClient = this.prisma as any;
    
    // Method 1: Use Prisma's DMMF (Data Model Meta Format) - Most reliable
    if (prismaClient._dmmf?.datamodel?.models) {
      for (const model of prismaClient._dmmf.datamodel.models) {
        // Only add models that actually exist in the database
        try {
          const modelInstance = prismaClient[model.name];
          if (modelInstance && typeof modelInstance.findMany === 'function') {
            const primaryKeyField = model.fields.find((field: any) => field.isId);
            const fields = model.fields.map((field: any) => field.name);
            
            this.prismaModels.set(model.name, {
              name: model.name,
              primaryKey: primaryKeyField?.name || 'id',
              fields: fields
            });
          }
        } catch (error) {
          // this.logger.debug(`Skipping model ${model.name}: ${error.message}`);
        }
      }
      this.modelCacheInitialized = true;
      // this.logger.log(`Discovered ${this.prismaModels.size} Prisma models from DMMF`);
      this.logModels();
      return;
    }

    // Fallback to dynamic discovery with better error handling
    await this.discoverModelsDynamically();
    
  } catch (error) {
    this.logger.error('Failed to initialize model cache', error);
    // Don't throw, continue with empty cache
    this.modelCacheInitialized = true;
  }
}

  private readonly knownValidModels = [
  'user', 'role', 'permission', 'auditLog', 'procedure', 'demande', 'permis',
  'typePermis', 'statutPermis', 'expertMinier', 'detenteurMorale', 'personnePhysique',
  'registreCommerce', 'comiteDirection', 'decisionCD', 'membresComite', 'seanceCDPrevue',
  'redevanceBareme', 'obligationFiscale', 'paiement', 'typePaiement', 'antenne',
  'wilaya', 'daira', 'commune', 'substance', 'dossierAdministratif', 'document'
];

private async discoverModelsDynamically(): Promise<void> {
  const prismaClient = this.prisma as any;
  
  // First, try known valid models
  for (const modelName of this.knownValidModels) {
    if (prismaClient[modelName] && typeof prismaClient[modelName]?.findMany === 'function') {
      try {
        const model = prismaClient[modelName];
        const count = await model.count({ take: 1 }).catch(() => 0);
        
        const primaryKey = await this.discoverPrimaryKey(modelName, model);
        const fields = await this.discoverFields(modelName, model);
        
        this.prismaModels.set(modelName, {
          name: modelName,
          primaryKey,
          fields
        });
        
      } catch (error) {
        this.logger.debug(`Known model ${modelName} failed: ${error.message}`);
      }
    }
  }

  // Then try other potential models more cautiously
  const potentialModels = Object.keys(prismaClient).filter(key => 
    !key.startsWith('_') && 
    !key.startsWith('$') && 
    typeof prismaClient[key] === 'object' &&
    prismaClient[key]?.findMany &&
    !this.knownValidModels.includes(key) // Skip already processed models
  );

  for (const modelName of potentialModels) {
    try {
      const model = prismaClient[modelName];
      
      // Quick test with timeout
      const testPromise = model.findFirst({ select: { id: true } });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 500)
      );
      
      await Promise.race([testPromise, timeoutPromise]);
      
      const primaryKey = await this.discoverPrimaryKey(modelName, model);
      const fields = await this.discoverFields(modelName, model);
      
      this.prismaModels.set(modelName, {
        name: modelName,
        primaryKey,
        fields
      });
      
    } catch (error) {
      // this.logger.debug(`Skipping model ${modelName}: ${error.message}`);
      continue;
    }
  }

  this.modelCacheInitialized = true;
  this.logger.log(`Discovered ${this.prismaModels.size} Prisma models dynamically`);
  this.logModels();
}

  private async discoverPrimaryKey(modelName: string, model: any): Promise<string> {
  try {
    const prismaClient = this.prisma as any;
    
    // Method 1: Use Prisma's DMMF (Data Model Meta Format) - Most reliable
    if (prismaClient._dmmf?.datamodel?.models) {
      const modelInfo = prismaClient._dmmf.datamodel.models.find(
        (m: any) => m.name === modelName
      );
      
      if (modelInfo) {
        const primaryKeyField = modelInfo.fields.find((field: any) => field.isId);
        if (primaryKeyField) {
          this.logger.debug(`Found primary key from DMMF: ${modelName}.${primaryKeyField.name}`);
          return primaryKeyField.name;
        }
      }
    }

    // Method 2: Use Prisma's modelMap
    if (prismaClient._dmmf?.modelMap) {
      const modelInfo = prismaClient._dmmf.modelMap[modelName];
      if (modelInfo) {
        const primaryKeyField = modelInfo.fields?.find((field: any) => field.isId);
        if (primaryKeyField) {
          this.logger.debug(`Found primary key from modelMap: ${modelName}.${primaryKeyField.name}`);
          return primaryKeyField.name;
        }
      }
    }

    // Method 3: Direct database introspection using raw SQL query
    try {
      const databaseUrl = process.env.DATABASE_URL;
      if (databaseUrl) {
        const dbType = databaseUrl.split(':')[0];
        
        if (dbType === 'postgresql') {
          // PostgreSQL specific query to get primary keys
          const result = await this.prisma.$queryRaw`
            SELECT a.attname as column_name
            FROM pg_index i
            JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
            WHERE i.indrelid = ${modelName}::regclass
            AND i.indisprimary;
          `;
          
          if (result && Array.isArray(result) && result.length > 0) {
            const primaryKey = result[0].column_name;
            // this.logger.debug(`Found primary key from PostgreSQL: ${modelName}.${primaryKey}`);
            return primaryKey;
          }
        } 
      }
    } catch (sqlError) {
      // this.logger.debug(`SQL introspection failed for ${modelName}: ${sqlError.message}`);
    }

    // Method 4: Use Prisma's internal metadata
    try {
      // Access Prisma's internal model metadata
      const modelMeta = (model as any)?._meta?.model;
      if (modelMeta?.primaryKey) {
        const primaryKeyFields = modelMeta.primaryKey.fields;
        if (primaryKeyFields && primaryKeyFields.length > 0) {
          // this.logger.debug(`Found primary key from Prisma meta: ${modelName}.${primaryKeyFields[0]}`);
          return primaryKeyFields[0];
        }
      }

      // Try to access the unique fields from the model
      const uniqueFields = modelMeta?.uniqueFields || [];
      if (uniqueFields.length > 0) {
        // Return the first unique field that looks like an ID
        const idField = uniqueFields.find((field: string) => 
          field.toLowerCase().includes('id') || field === 'id'
        );
        if (idField) {
          // this.logger.debug(`Found unique ID field: ${modelName}.${idField}`);
          return idField;
        }
        return uniqueFields[0];
      }
    } catch (metaError) {
      // this.logger.debug(`Metadata access failed for ${modelName}: ${metaError.message}`);
    }

    // Method 5: Fallback to analyzing the first record
    try {
      const record = await model.findFirst({});
      if (record) {
        // Look for fields that are likely primary keys
        const possibleKeys = Object.keys(record).filter(key => 
          (key === 'id' || key.toLowerCase().includes('id')) &&
          (typeof record[key] === 'number' || typeof record[key] === 'string' || typeof record[key] === 'bigint')
        );

        if (possibleKeys.length > 0) {
          const primaryKey = possibleKeys[0];
          // this.logger.debug(`Found primary key from record analysis: ${modelName}.${primaryKey}`);
          return primaryKey;
        }
      }
    } catch (findError) {
      // this.logger.debug(`Record analysis failed for ${modelName}: ${findError.message}`);
    }

    // Ultimate fallback
    // this.logger.warn(`Using fallback primary key 'id' for model: ${modelName}`);
    return 'id';

  } catch (error) {
    // this.logger.error(`Failed to discover primary key for ${modelName}: ${error.message}`);
    return 'id';
  }
}

  private async discoverFields(modelName: string, model: any): Promise<string[]> {
    try {
      const record = await model.findFirst({});
      return record ? Object.keys(record) : [];
    } catch (error) {
      // this.logger.debug(`Failed to discover fields for ${modelName}: ${error.message}`);
      return [];
    }
  }

  private logModels(): void {
    this.logger.debug('=== PRISMA MODELS DISCOVERED ===');
    this.prismaModels.forEach((modelInfo, modelName) => {
      // this.logger.debug(`Model: ${modelName}, PK: ${modelInfo.primaryKey}, Fields: ${modelInfo.fields.length}`);
    });
  }

  private async getPrismaModelName(entityType: string): Promise<string | null> {
      // this.logger.debug(`Looking up model for entity type: ${entityType}`);

  if (!entityType) return null;

  const entityLower = entityType.toLowerCase();

  // 1. Exact match (case insensitive)
  for (const [modelName] of this.prismaModels) {
    if (modelName.toLowerCase() === entityLower) {
      return modelName;
    }
  }

  // 2. French to model mapping for common cases
  const frenchMappings: Record<string, string> = {
    'GeneratePermis': 'permis',
    'generate-permis': 'permis',
    'generate_permis': 'permis',
    'generation-permis': 'permis',
    'societe': 'detenteurMorale',
    'société': 'detenteurMorale',
    'entreprise': 'detenteurMorale',
    'company': 'detenteurMorale',
    'utilisateur': 'user',
    'usager': 'user',
    'rôle': 'role',
    'role': 'role',
    'permission': 'permission',
    'autorisation': 'permission',
    'groupe': 'group',
    'demande': 'demande',
    'request': 'demande',
    'procedure': 'procedure',
    'process': 'procedure',
    'expert': 'expertMinier',
    'substance': 'substance',
    'dossier': 'dossierAdministratif',
    'document': 'document',
    'file': 'document',
    'permis': 'permis',
    'permit': 'permis',
    'license': 'permis',
    'statut': 'statutPermis',
    'status': 'statutPermis',
    'type': 'typePermis',
    'interaction': 'interactionWali',
    'comite': 'comiteDirection',
    'committee': 'comiteDirection',
    'decision': 'decisionCD',
    'membre': 'membresComite',
    'member': 'membresComite',
    'juridique': 'statutJuridique',
    'legal': 'statutJuridique',
    'detenteur': 'detenteurMorale',
    'holder': 'detenteurMorale',
    'morale': 'detenteurMorale',
    'moral': 'detenteurMorale',
    'registre': 'registreCommerce',
    'register': 'registreCommerce',
    'commerce': 'registreCommerce',
    'trade': 'registreCommerce',
    'personne': 'personnePhysique',
    'person': 'personnePhysique',
    'physique': 'personnePhysique',
    'physical': 'personnePhysique',
    'fonction': 'fonctionPersonneMoral',
    'function': 'fonctionPersonneMoral',
    'redevance': 'redevanceBareme',
    'royalty': 'redevanceBareme',
    'bareme': 'redevanceBareme',
    'fee': 'redevanceBareme',
    'seance': 'seanceCDPrevue',
    'session': 'seanceCDPrevue',
    'meeting': 'seanceCDPrevue',
    'zone': 'zoneInterdite',
    'area': 'zoneInterdite',
    'region': 'zoneInterdite',
    'interdite': 'zoneInterdite',
    'forbidden': 'zoneInterdite',
    'restricted': 'zoneInterdite',
    'coordonnee': 'coordonnee',
    'coordinate': 'coordonnee',
    'location': 'coordonnee',
    'antenne': 'antenne',
    'branch': 'antenne',
    'office': 'antenne',
    'wilaya': 'wilaya',
    'province': 'wilaya',
    'state': 'wilaya',
    'daira': 'daira',
    'district': 'daira',
    'commune': 'commune',
    'municipality': 'commune',
    'town': 'commune',
    'cahier': 'cahierCharge',
    'charge': 'cahierCharge',
    'specification': 'cahierCharge',
    'rapport': 'rapportActivite',
    'report': 'rapportActivite',
    'activite': 'rapportActivite',
    'activity': 'rapportActivite',
    'paiement': 'paiement',
    'payment': 'paiement',
    'obligation': 'obligationFiscale',
    'fiscale': 'obligationFiscale',
    'tax': 'obligationFiscale',
    'superficiaire': 'superficiaireBareme',
    'surface': 'superficiaireBareme',
  };

  // Check French mappings
  if (frenchMappings[entityLower]) {
    const mappedModel = frenchMappings[entityLower];
    if (this.prismaModels.has(mappedModel)) {
      return mappedModel;
    }
  }

  // 3. Try common naming patterns
  const patterns = this.generateNamePatterns(entityType);
  for (const pattern of patterns) {
    for (const [modelName] of this.prismaModels) {
      if (modelName.toLowerCase() === pattern.toLowerCase()) {
        return modelName;
      }
    }
  }

  // 4. Try partial matching with field content analysis
  const bestMatch = await this.findBestModelByContent(entityType);
  if (bestMatch) {
    return bestMatch;
  }

  // 5. Try semantic similarity based on field names and content
  const semanticMatch = await this.findSemanticMatch(entityType);
  if (semanticMatch) {
    return semanticMatch;
  }

  // this.logger.warn(`No Prisma model found for entity type: ${entityType}`);
  // this.logger.debug(`Available models: ${Array.from(this.prismaModels.keys()).join(', ')}`);
  return null;
}

private async findSemanticMatch(entityType: string): Promise<string | null> {
  const entityLower = entityType.toLowerCase();
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const [modelName, modelInfo] of this.prismaModels) {
    let score = 0;

    // Score based on field names containing entity-related terms
    const modelLower = modelName.toLowerCase();
    const fieldNames = modelInfo.fields.join(' ').toLowerCase();

    // Check if entity appears in field names
    if (fieldNames.includes(entityLower)) {
      score += 2;
    }

    // Check if model name contains parts of entity
    if (modelLower.includes(entityLower) || entityLower.includes(modelLower)) {
      score += 3;
    }

    // Check for common prefixes/suffixes
    const commonPrefixes = ['id_', 'nom_', 'code_', 'type_', 'statut_'];
    for (const prefix of commonPrefixes) {
      if (fieldNames.includes(prefix + entityLower)) {
        score += 2;
      }
    }

    // Try to get sample data for better matching
    try {
      const model = (this.prisma as any)[modelName];
      const sample = await model.findFirst({});
      if (sample) {
        const sampleValues = Object.values(sample).join(' ').toLowerCase();
        if (sampleValues.includes(entityLower)) {
          score += 1;
        }
      }
    } catch (error) {
      // Continue if sample cannot be fetched
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = modelName;
    }
  }

  return bestScore >= 2 ? bestMatch : null;
}

  private generateNamePatterns(entityType: string): string[] {
    const patterns: string[] = [];
    const lowerEntity = entityType.toLowerCase();

    patterns.push(lowerEntity);
    patterns.push(lowerEntity + 's'); // plural
    patterns.push(lowerEntity.replace(/s$/, '')); // singular
    patterns.push(lowerEntity.replace(/ies$/, 'y')); // category -> categories
    patterns.push(lowerEntity.replace(/e$/, '')); // service -> services

    // CamelCase to snake_case and vice versa
    patterns.push(lowerEntity.replace(/([A-Z])/g, '_$1').toLowerCase());
    patterns.push(lowerEntity.replace(/_/g, ''));

    return patterns;
  }

  private async findBestModelByContent(entityType: string): Promise<string | null> {
    const entityLower = entityType.toLowerCase();
    let bestMatch: string | null = null;
    let bestScore = 0;

    for (const [modelName, modelInfo] of this.prismaModels) {
      let score = 0;

      // Score based on model name similarity
      const modelLower = modelName.toLowerCase();
      if (modelLower.includes(entityLower) || entityLower.includes(modelLower)) {
        score += 3;
      }

      // Score based on field content (if we have a sample record)
      try {
        const model = (this.prisma as any)[modelName];
        const sample = await model.findFirst({});
        if (sample) {
          const sampleValues = Object.values(sample).join(' ').toLowerCase();
          if (sampleValues.includes(entityLower)) {
            score += 2;
          }
        }
      } catch (error) {
        // Continue if sample cannot be fetched
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = modelName;
      }
    }

    return bestScore >= 3 ? bestMatch : null;
  }

  private async getPreviousState(modelName: string, entityId: number): Promise<any> {
  try {
    const prismaClient = this.prisma as any;
    const model = prismaClient[modelName];
    
    if (!model?.findUnique) {
      throw new Error(`Model ${modelName} not found`);
    }

    const modelInfo = this.prismaModels.get(modelName);
    const primaryKey = modelInfo?.primaryKey || 'id';

    this.logger.debug(`Fetching previous state for ${modelName} with ${primaryKey}=${entityId}`);
    this.logger.debug(`Available fields for ${modelName}: ${modelInfo?.fields?.join(', ') || 'unknown'}`);

    // Debug: Check what fields the model actually expects
    try {
      const sample = await model.findFirst({});
      if (sample) {
        this.logger.debug(`Sample record fields: ${Object.keys(sample).join(', ')}`);
      }
    } catch (sampleError) {
      this.logger.debug(`Could not get sample record: ${sampleError.message}`);
    }

    return await model.findUnique({
      where: { [primaryKey]: entityId },
    });
    
  } catch (error) {
    this.logger.error(`Detailed error fetching ${modelName}:${entityId}`, {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    
    if (error instanceof PrismaClientKnownRequestError) {
      // this.logger.error(`Prisma error code: ${error.code}`);
    }
    
    return null;
  }
}

  private getEntityType(context: ExecutionContext, url: string): string {
    // 1. Try to get from metadata
    const auditLogMetadata = this.reflector.get<{ entityType?: string }>(
      'audit-log',
      context.getHandler(),
    );
    
    if (auditLogMetadata?.entityType) {
      return auditLogMetadata.entityType;
    }

    // 2. Try controller name
    const controllerName = context.getClass().name;
    if (controllerName.endsWith('Controller')) {
      const entityName = controllerName.replace('Controller', '');
      if (entityName && !['App', 'Api', 'Default'].includes(entityName)) {
        return entityName;
      }
    }

    // 3. Parse from URL
    const parts = url.split('/').filter(Boolean);
    const excludedPrefixes = ['api', 'admin', 'auth', 'v1', 'v2', 'public'];
    
    for (const part of parts) {
      if (!excludedPrefixes.includes(part.toLowerCase()) && 
          !part.match(/^\d+$/) &&
          part.length > 2) {
        // Convert to PascalCase
        return part
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join('');
      }
    }

    return 'Unknown';
  }

  private async logAction({ request, action, entityType, entityId, changes, previousState, status, error, response }: any) {
    try {
      const userId = request.user?.id || request.headers['x-user-id'] || request.user?.sub || (request.session?.userId ? Number(request.session.userId) : null);
      const userName = request.user?.username || request.headers['x-user-name'] || request.user?.name || request.user?.email || (userId ? `User-${userId}` : 'System');

      let sanitizedPreviousState = previousState;
      if (previousState) {
        sanitizedPreviousState = { ...previousState };
        Object.keys(sanitizedPreviousState).forEach(key => {
          if (this.isSensitiveField(key)) {
            delete sanitizedPreviousState![key];
          }
        });
      }

      let sanitizedChanges = changes;
      if (changes) {
        sanitizedChanges = { ...changes };
        Object.keys(sanitizedChanges).forEach(key => {
          if (this.isSensitiveField(key)) {
            delete sanitizedChanges[key];
          }
        });
      }

      await this.auditLogService.log({
        action,
        entityType,
        entityId: entityId !== undefined ? entityId : null,
        userId: userId ? Number(userId) : null,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
        changes: Object.keys(sanitizedChanges).length > 0 ? sanitizedChanges : null,
        previousState: sanitizedPreviousState,
        status,
        errorMessage: error?.message,
        additionalData: {
          endpoint: request.originalUrl,
          method: request.method,
          userName,
          requestBody: this.sanitizeRequestBody(request.body),
          ...(response ? { responseData: this.sanitizeResponse(response) } : {})
        },
      });

      this.logger.log(`Audit log saved for ${action} on ${entityType} ${entityId}`);
    } catch (err) {
      this.logger.error('Failed to log audit action', err, err.stack);
    }
  }


  private sanitizeRequestBody(body: any): any {
    if (!body || typeof body !== 'object') return body;
    const sanitized = { ...body };
    Object.keys(sanitized).forEach(key => {
      if (this.isSensitiveField(key)) {
        sanitized[key] = '***REDACTED***';
      }
    });
    return sanitized;
  }

  private sanitizeResponse(response: any): any {
    if (!response || typeof response !== 'object') return response;
    const sanitized = { ...response };
    Object.keys(sanitized).forEach(key => {
      if (this.isSensitiveField(key)) {
        sanitized[key] = '***REDACTED***';
      }
    });
    return sanitized;
  }

  private getCreateChanges(requestBody: any, response: any): Record<string, { new: any }> {
    const changes: Record<string, { new: any }> = {};
    Object.keys(response).forEach(key => {
      if (!['password', 'token', 'refreshToken'].includes(key)) {
        changes[key] = { new: response[key] };
      }
    });
    Object.keys(requestBody || {}).forEach(key => {
      if (!changes[key] && !['password', 'token'].includes(key)) {
        changes[key] = { new: requestBody[key] };
      }
    });
    return changes;
  }


   private getAction(method: string): string {
    const actionMap = { POST: 'CREATE', PUT: 'UPDATE', PATCH: 'UPDATE', DELETE: 'DELETE' };
    return actionMap[method] || method;
  }

  private getChanges(requestBody: any, previousState: any, method: string): Record<string, { old?: any; new: any }> | undefined {
    const changes: Record<string, { old?: any; new: any }> = {};
    const safeBody = requestBody || {};

    if (method === 'DELETE' && previousState) {
      Object.keys(previousState).forEach(key => {
        if (!this.isSensitiveField(key) && previousState[key] !== undefined) {
          changes[key] = { old: previousState[key], new: null };
        }
      });
      return Object.keys(changes).length > 0 ? changes : undefined;
    }

    Object.keys(safeBody).forEach(key => {
      if (!this.isSensitiveField(key) && safeBody[key] !== undefined) {
        changes[key] = { new: safeBody[key] };
      }
    });

    if (previousState && ['PUT', 'PATCH'].includes(method)) {
      Object.keys(changes).forEach(key => {
        if (previousState[key] !== undefined) {
          changes[key] = { old: previousState[key], new: changes[key].new };
        }
      });

      Object.keys(previousState).forEach(key => {
        if (!this.isSensitiveField(key) && previousState[key] !== undefined && !changes[key] && safeBody[key] === undefined) {
          changes[key] = { old: previousState[key], new: previousState[key] };
        }
      });
    }

    return Object.keys(changes).length > 0 ? changes : undefined;
  }

  private shouldSkipLogging(request: Request): boolean {
    return request.url.includes('/auth/');
  }

  private isSensitiveField(fieldName: string): boolean {
    const sensitivePatterns = [
      /password/i, /token/i, /secret/i, /key/i, /hash/i, /salt/i, /credential/i, /auth/i, /private/i, /secure/i
    ];
    return sensitivePatterns.some(pattern => pattern.test(fieldName));
  }
  
}