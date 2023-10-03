import { Model, ForeignKey, Column, Table, DataType, Index } from 'sequelize-typescript';
import { User } from './user';

@Table
export class NotificationsHistory extends Model<NotificationsHistory> {

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  @Index
  userId!: string;

  @Column(DataType.STRING)
  notificationType!: string;

  @Column(DataType.STRING)
  notificationText!: string;

  @Column(DataType.DATE)
  sentAt!: Date;

  @Column(DataType.INTEGER)
  referenceId!: number;

  @Column(DataType.STRING)
  referenceType!: string;
}
