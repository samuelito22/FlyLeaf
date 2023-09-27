import { Model, Column, Table, Index, CreatedAt, DataType } from 'sequelize-typescript';

@Table({ tableName: 'EmailToken', updatedAt: false })
export class EmailToken extends Model<EmailToken> {

  @Index
  @Column({type:DataType.STRING, unique:true})
  email!: string;

  @Column(DataType.STRING)
  token!: string;

  @CreatedAt
  createdAt!: Date;
}
