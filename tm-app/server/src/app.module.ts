import { Module } from '@nestjs/common';
import { PermisModule } from './permis/permis.module';
import { HealthController } from './health.controller';
import { ArticleSetsController } from './article-sets/article-sets.controller';
import { ArticleSetsService } from './article-sets/article-sets.service';

@Module({
  imports: [PermisModule],
  controllers: [HealthController, ArticleSetsController],
  providers: [ArticleSetsService]
})
export class AppModule {}
