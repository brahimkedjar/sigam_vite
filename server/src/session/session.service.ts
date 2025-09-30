// src/session/session.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto'; 

@Injectable()
export class SessionService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async createSession(userId: number) {
    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + this.getSessionDuration());
    
    return this.prisma.session.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async validateSession(token: string) {
    return this.prisma.session.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async deleteSession(token: string) {
    return this.prisma.session.deleteMany({
      where: { token },
    });
  }

  async cleanupExpiredSessions() {
    return this.prisma.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }

  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private getSessionDuration(): number {
    return this.config.get<number>('SESSION_DURATION', 24 * 60 * 60 * 1000); // Default 24 hours
  }

    async extendSession(token: string) {
  return this.prisma.session.update({
    where: { token },
    data: { expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) } // Extend by 24 hours
  });
}
}