import { Model, ForeignKey, Column, Table, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { User } from './user';
import { Conversations } from './conversations';

@Table
export class Messages extends Model<Messages> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Conversations)
  @Column(DataType.INTEGER)
  conversationId!: number;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @Column(DataType.STRING)
  text!: string;

  @Column(DataType.DATE)
  sentAt!: Date;

  @Column(DataType.ENUM('read', 'delivered'))
  status!: 'read' | 'delivered';
}
