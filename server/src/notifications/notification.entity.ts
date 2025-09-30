// notification.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Expert } from './expertminier';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  relatedEntityId: number;

  @Column({ nullable: true })
  relatedEntityType: string;

  @ManyToOne(() => Expert, { nullable: true })
  @JoinColumn({ name: 'expertId' })
  expert: Expert;

  @Column({ nullable: true })
  expertId: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'info' })
  priority: string;
}