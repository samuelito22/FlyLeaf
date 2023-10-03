import { Model, ForeignKey, Column, Table, DataType, Index } from 'sequelize-typescript';
import { User } from './user';

@Table
export class UserBlocked extends Model<UserBlocked> {

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  @Index
  userId!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  @Index
  blockedUserId!: string;

  @Column(DataType.DATE)
  blockedDate!: Date;

  @Column(DataType.STRING)
  reason!: string;
}
