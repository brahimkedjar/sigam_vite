// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private sessionService: SessionService,
  ) {}

  private sessionLocks = new Map<string, Promise<any>>();

  private async withSessionLock<T>(
    token: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    if (this.sessionLocks.has(token)) {
      await this.sessionLocks.get(token);
    }

    const lockPromise = operation().finally(() => {
      this.sessionLocks.delete(token);
    });

    this.sessionLocks.set(token, lockPromise);
    return lockPromise;
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    return user;
  }

  async login(user: any) {
    return this.withSessionLock(`login-${user.id}`, async () => {
      const session = await this.sessionService.createSession(user.id);

      return {
        token: session.token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role.name,
          permissions: user.role.rolePermissions.map(
            (rp) => rp.permission.name,
          ),
        },
      };
    });
  }

  async verifyToken(token: string) {
    return this.withSessionLock(token, async () => {
      const session = await this.sessionService.validateSession(token);
      if (!session) return null;

      // Extend session expiration
      await this.sessionService.extendSession(token);

      return {
        id: session.user.id,
        username: session.user.username,
        email: session.user.email,
        role: session.user.role!.name,
        permissions: session.user.role!.rolePermissions.map(
          (rp) => rp.permission.name,
        ),
      };
    });
  }

  async logout(token: string) {
    return this.withSessionLock(token, () =>
      this.sessionService.deleteSession(token),
    );
  }

  async register(body: {
    email: string;
    password: string;
    role: string;
    nom?: string;
    Prenom?: string;
    username?: string;
  }) {
    const hashed = await bcrypt.hash(body.password, 10);

    const existingRole = await this.prisma.role.findUnique({
      where: { name: body.role },
    });

    if (!existingRole) {
      throw new Error(`Role "${body.role}" does not exist`);
    }

    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        password: hashed,
        roleId: existingRole.id,
        nom: body.nom || '',
        Prenom: body.Prenom || '',
        username: body.username || body.email,
      },
    });

    return { message: 'User registered', userId: user.id };
  }
}
