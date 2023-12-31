import { Model, ForeignKey, Column, Table, DataType, PrimaryKey, AutoIncrement, Index } from 'sequelize-typescript';
import { User } from './user';

@Table
export class Conversations extends Model<Conversations> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Index
  @Column(DataType.UUID)
  user1Id!: string;

  @ForeignKey(() => User)
  @Index
  @Column(DataType.UUID)
  user2Id!: string;

  @Column(DataType.FLOAT)
  clarityLevel!: number;

  @Column(DataType.DATE)
  lastUpdated!: Date;
}
