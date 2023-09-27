import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    BelongsTo
  } from 'sequelize-typescript';
import { User } from './user';
  
  @Table({ timestamps: false })
  export class Languages extends Model<Languages> {
  
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
  
    @Column(DataType.STRING)
    text!: string;
  }
  

  @Table
export class UserLanguages extends Model<UserLanguages> {

  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @PrimaryKey
  @ForeignKey(() => Languages)
  @Column(DataType.INTEGER)
  languageId!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Languages)
  language!: Languages;
}