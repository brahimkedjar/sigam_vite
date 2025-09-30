// src/session/session.cleanup.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { SessionService } from './session.service';

@Injectable()
export class SessionCleanupService implements OnModuleInit {
  constructor(private sessionService: SessionService) {}

  onModuleInit() {
    this.cleanup();
    // Run cleanup every hour
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }

  async cleanup() {
    try {
      const count = await this.sessionService.cleanupExpiredSessions();
      console.log(`Cleaned up ${count} expired sessions`);
    } catch (error) {
      console.error('Session cleanup failed:', error);
    }
  }
}