// notifications.controller.ts
import { Controller, Get, Param, Post, Query, Sse } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Observable, from, interval, map, switchMap } from 'rxjs';
import { Notification } from './notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

 @Get()
async getNotifications(@Query('unreadOnly') unreadOnly: string) {
  const unread = unreadOnly !== 'false';
  return await this.notificationsService.getUserNotifications(1, unread);
}

  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    await this.notificationsService.markAsRead(parseInt(id));
    return { success: true };
  }

  @Post('read-all')
  async markAllAsRead() {
    await this.notificationsService.markAllAsRead(1); // Replace 1 with actual user ID
    return { success: true };
  }

  @Get('count')
  async getUnreadCount() {
    const count = await this.notificationsService.getUnreadCount();
    return { count };
  }

@Sse('sse')
sse(): Observable<MessageEvent> {
  return interval(5000).pipe(
    switchMap(() =>
      from(this.notificationsService.getUnreadCount()).pipe(
        map((count) => ({
          data: { count, timestamp: new Date().toISOString() },
        }) as MessageEvent),
      ),
    ),
  );
}
}
interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}