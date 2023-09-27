import { Model, ForeignKey, Column, Table, DataType } from 'sequelize-typescript';
import { User } from './user';

@Table
export class UserBlocked extends Model<UserBlocked> {

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  blockedUserId!: string;

  @Column(DataType.DATE)
  blockedDate!: Date;

  @Column(DataType.STRING)
  reason!: string;
}
