import { Model, ForeignKey, Column, Table, DataType, Index } from 'sequelize-typescript';
import { User } from './user';
import { PrimaryGender } from './gender';

@Table
export class UserSeekingGender extends Model<UserSeekingGender> {
  
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  @Index
  userId!: string;

  @ForeignKey(() => PrimaryGender)
  @Column(DataType.INTEGER)
  primaryGenderId!: number;
}
