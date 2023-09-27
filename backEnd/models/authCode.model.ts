import { Model, Column, Table, ForeignKey, DataType,  Index, CreatedAt } from 'sequelize-typescript';
import { User } from './user'; // Assuming User.ts is in the same directory

@Table({ tableName: 'AuthCode', updatedAt: false })
export class AuthCode extends Model<AuthCode> {

  @Index
  @Column(DataType.STRING)
  code!: string;

  @ForeignKey(() => User)
  @Column({type:DataType.UUID, unique: true})
  userId!: string;

  @CreatedAt
  createdAt!: Date;
}
