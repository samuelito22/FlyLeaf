import { Model, ForeignKey, Column, Table, DataType } from 'sequelize-typescript';
import { User } from './user';

@Table
export class UserMatches extends Model<UserMatches> {
  
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
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
