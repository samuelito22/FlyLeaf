import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo
  } from 'sequelize-typescript';
import { User } from './user';
  
  @Table
  export class NotificationSettings extends Model<NotificationSettings> {
  
    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId!: string;
  
    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    emailNotifications!: boolean;
  
    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    newMessageNotification!: boolean;
  
    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    newMatchNotification!: boolean;
  
    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    pushNotifications!: boolean;
  
    @BelongsTo(() => User)
    user!: User;
  }
  