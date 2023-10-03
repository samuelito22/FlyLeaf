import { Model, ForeignKey, Column, Table, DataType, Index } from 'sequelize-typescript';
import { User } from './user';

@Table
export class UserMatches extends Model<UserMatches> {
  
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  @Index
  userId!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  @Index
  matchedUserId!: string;

  @Column({
    type: DataType.ENUM,
    values: ['pending', 'approved', 'blocked'],
    allowNull: false,
    defaultValue: 'pending'
  })
  status!: string;

  @Column(DataType.DATE)
  matchedDate!: Date;
}
