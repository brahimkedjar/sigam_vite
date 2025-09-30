import { Module } from '@nestjs/common';
import { ExpertMinierService } from './expert-minier.service';
import { ExpertMinierController } from './expert-minier.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/notifications/notification.entity';
import { Expert } from 'src/notifications/expertminier';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Expert])],  // 👈 add this
  controllers: [ExpertMinierController],
  providers: [ExpertMinierService, PrismaService, NotificationsService],
  exports: [TypeOrmModule], // 👈 optional: if other modules need these repos
})
export class ExpertMinierModule {}
