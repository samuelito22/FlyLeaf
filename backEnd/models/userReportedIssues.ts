import { Model, ForeignKey, Column, Table, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { User } from './user';

@Table
export class UserReportedIssues extends Model<UserReportedIssues> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  reporterId!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  reportedUserId!: string;

  @Column(DataType.STRING)
  issueDescription!: string;

  @Column(DataType.STRING)
  issueType!: string;

  @Column(DataType.DATE)
  reportDate!: Date;
}
