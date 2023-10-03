import { Model, ForeignKey, Column, Table, DataType, PrimaryKey, AutoIncrement, Index } from 'sequelize-typescript';
import { User } from './user';

@Table
export class InstagramTokens extends Model<InstagramTokens> {

  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  @Index
  userId!: string;

  @Column(DataType.STRING)
  accessToken!: string;

  @Column(DataType.DATE)
  tokenExpiration!: Date;
}

@Table
export class InstagramImages extends Model<InstagramImages> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  @Index
  userId!: string;

  @Column(DataType.STRING)
  imageUrl!: string;
}