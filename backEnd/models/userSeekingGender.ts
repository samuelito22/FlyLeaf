import { Model, ForeignKey, Column, Table, DataType } from 'sequelize-typescript';
import { User } from './user';
import { PrimaryGender } from './gender';

@Table
export class UserSeekingGender extends Model<UserSeekingGender> {
  
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @ForeignKey(() => PrimaryGender)
  @Column(DataType.INTEGER)
  primaryGenderId!: number;
}
