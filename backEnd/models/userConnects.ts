import { Model, ForeignKey, Column, Table, DataType, Index } from 'sequelize-typescript';
import { User } from './user';

@Table
export class UserConnects extends Model<UserConnects> {

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  @Index
  userId!: string;

  @Column(DataType.INTEGER)
  remainingCount!: number;

  @Column({type: DataType.ENUM , values: ['Connect Token', 'Super Connect'],
  allowNull: false})
  connectType!: 'Connect Token' | 'Super Connect';
}
