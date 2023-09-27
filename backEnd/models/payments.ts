import { Model, ForeignKey, Column, Table, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { User } from './user';

@Table
export class Payments extends Model<Payments> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @Column(DataType.STRING)
  paymentMethod!: string;

  @Column(DataType.DATE)
  paymentDate!: Date;

  @Column(DataType.FLOAT)
  amount!: number;
}
