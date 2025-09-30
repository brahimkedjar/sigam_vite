import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ArticleSetsService, ArticleSet } from './article-sets.service';

@Controller('api/article-sets')
export class ArticleSetsController {
  constructor(private readonly svc: ArticleSetsService) {}

  @Get()
  list() {
    return this.svc.list();
  }

  @Get(':key')
  get(@Param('key') key: string) {
    return this.svc.get(key);
  }

  @Post('import')
  import(@Body() payload: any) {
    return this.svc.importFromBody(payload);
  }

  @Put(':key')
  upsert(@Param('key') key: string, @Body() body: ArticleSet) {
    return this.svc.upsert(key, body);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.svc.remove(key);
  }
}

