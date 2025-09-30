import { Module } from '@nestjs/common';
import { ArticleSetsService } from './article-sets.service';
import { ArticleSetsController } from './article-sets.controller';

@Module({
  controllers: [ArticleSetsController],
  providers: [ArticleSetsService],
  exports: [ArticleSetsService],
})
export class ArticleSetsModule {}

