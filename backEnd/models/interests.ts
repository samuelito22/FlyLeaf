import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    BelongsTo,
    ForeignKey,
    Index
  } from 'sequelize-typescript';
import { User } from './user';
  
  @Table ({ timestamps: false })
  export class InterestsCategory extends Model<InterestsCategory> {
  
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    @Index
    id!: number;
  
    @Column(DataType.STRING)
    text!: string;
  }
  

  @Table ({ timestamps: false })
export class Interests extends Model<Interests> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  text!: string;

  @ForeignKey(() => InterestsCategory)
  @Column(DataType.INTEGER)
  categoryId!: number;

  @BelongsTo(() => InterestsCategory)
  category!: InterestsCategory;
}

@Table
export class UserInterests extends Model<UserInterests> {

  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  @Index
  userId!: string;

  @PrimaryKey
  @ForeignKey(() => Interests)
  @Column(DataType.INTEGER)
  interestId!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Interests)
  interest!: Interests;
}