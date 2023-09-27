import { Model, Column, Table, Unique, Index, CreatedAt, DataType } from 'sequelize-typescript';

@Table({ tableName: 'PhoneNumberOTP', updatedAt: false })
export class PhoneNumberOTP extends Model<PhoneNumberOTP> {

  @Column({type:DataType.STRING, unique:true})
  phoneNumber!: string;

  @Column(DataType.STRING)
  otp!: string;

  @CreatedAt
  createdAt!: Date;
}
