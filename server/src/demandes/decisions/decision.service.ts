// decisions/decision.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDecisionDto } from '../dto/create-decision.dto';

@Injectable()
export class DecisionService {
  constructor(private prisma: PrismaService) {}

  async createDecision(createDecisionDto: CreateDecisionDto & { id_comite: number }) {
    return this.prisma.decisionCD.create({
      data: {
        id_comite: createDecisionDto.id_comite,
        decision_cd: createDecisionDto.decision_cd,
        duree_decision: createDecisionDto.duree_decision,
        commentaires: createDecisionDto.commentaires,
        numero_decision: createDecisionDto.numero_decision     
      }
    });
  }

  async updateDecision(id: number, updateDecisionDto: CreateDecisionDto) {
    return this.prisma.decisionCD.update({
      where: { id_decision: id },
      data: {
        decision_cd: updateDecisionDto.decision_cd,
        duree_decision: updateDecisionDto.duree_decision,
        commentaires: updateDecisionDto.commentaires
      }
    });
  }

  async getDecisionForProcedure(id_comite: number) {
    return this.prisma.decisionCD.findFirst({
      where: { id_comite }
    });
  }
}