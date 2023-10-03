import { Model, Column, Table, DataType, PrimaryKey, AutoIncrement, ForeignKey, Index } from 'sequelize-typescript';
import { User } from './user';

@Table
export class UserFeedback extends Model<UserFeedback> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  @Index
  userId!: string;

  @Column(DataType.STRING)
  feedbackText!: string;

  @Column(DataType.DATE)
  submittedDate!: Date;
}
