// src/permis/dto/update-permis.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePermisDto } from './create-permis.dto';

export class UpdatePermisDto extends PartialType(CreatePermisDto) {}