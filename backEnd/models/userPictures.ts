import {
  Model,
  ForeignKey,
  Column,
  Table,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  Index,
} from 'sequelize-typescript';
import { User } from './user';

@Table
export class UserPictures extends Model<UserPictures> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Index
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  url?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
