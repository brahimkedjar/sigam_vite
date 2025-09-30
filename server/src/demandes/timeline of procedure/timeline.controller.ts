import { Controller, Get, Param } from '@nestjs/common';
import { TimelineService } from './timeline.service';

@Controller('timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get(':procedureId')
  async getTimeline(@Param('procedureId') procedureId: string) {
    return this.timelineService.getProcedureTimeline(parseInt(procedureId));
  }
}