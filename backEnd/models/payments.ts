import { Model, ForeignKey, Column, Table, DataType, PrimaryKey, AutoIncrement, Index } from 'sequelize-typescript';
import { User } from './user';

@Table
export class Payments extends Model<Payments> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  @Index
  userId!: string;

  @Column(DataType.STRING)
  paymentMethod!: string;

  @Column(DataType.DATE)
  paymentDate!: Date;

  @Column(DataType.FLOAT)
  amount!: number;
}
