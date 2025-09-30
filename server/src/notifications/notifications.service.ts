// notifications.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { Expert } from './expertminier';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Expert)
    private expertRepository: Repository<Expert>,
    private prisma: PrismaService
  ) {}

  async createExpertNotification(expert: any, type: string) {
    const title = this.getExpertNotificationTitle(type);
    const expertName = expert.nom_expert || 'Nom non spécifié';
    const agrementNumber = expert.num_agrement || 'Numéro non spécifié';
    const message = this.getExpertNotificationMessage(expertName, agrementNumber, type);

    return this.prisma.notification.create({
      data: {
        type,
        title,
        message,
        relatedEntityId: expert.id_expert,
        relatedEntityType: 'expertminier',
        expertId: expert.id_expert,
        priority: 'info',
      },
    });
  }


  private getExpertNotificationTitle(type: string): string {
    const titles = {
      'expert_created': 'Nouvel Expert Minier',
      'expert_updated': 'Expert Minier Modifié',
      'expert_deleted': 'Expert Minier Supprimé',
    };
    return titles[type] || 'Notification Expert Minier';
  }

 private getExpertNotificationMessage(
  expertName: string, 
  agrementNumber: string, 
  type: string
): string {
  const messages = {
    'expert_created': `L'expert minier "${expertName}" a été créé avec le numéro d'agrément ${agrementNumber}`,
    'expert_updated': `Les informations de l'expert minier "${expertName}" ont été mises à jour`,
    'expert_deleted': `L'expert minier "${expertName}" a été supprimé du système`,
  };
  return messages[type] || `Notification pour l'expert ${expertName}`;
}

  async getUserNotifications(userId: number, unreadOnly: boolean = true): Promise<Notification[]> {
    const query = this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.expert', 'expert')
      .orderBy('notification.createdAt', 'DESC');

    if (unreadOnly) {
      query.where('notification.isRead = :isRead', { isRead: false });
    }

    return query.getMany();
  }

  async markAsRead(notificationId: number): Promise<void> {
    await this.notificationRepository.update(notificationId, { isRead: true });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { isRead: false },
      { isRead: true }
    );
  }

  async getUnreadCount(): Promise<number> {
    return this.notificationRepository.count({ where: { isRead: false } });
  }
}