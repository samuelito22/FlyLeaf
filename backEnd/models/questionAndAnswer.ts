import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    IsIn,
    BelongsTo,
    ForeignKey,
    Index
  } from 'sequelize-typescript';
import { User } from './user';
  
  @Table({ timestamps: false })
  export class Questions extends Model<Questions> {
  
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
  
    @Column(DataType.STRING)
    shortForm!: string;
  
    @IsIn([['basic', 'advanced']])
    @Column(DataType.STRING)
    type!: 'basic' | 'advanced';
  
    @Column(DataType.STRING)
    iconPath!: string;
  
    @Column(DataType.STRING)
    text!: string;
  }

  @Table({ timestamps: false })
  export class Answers extends Model<Answers> {
  
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
  
    @ForeignKey(() => Questions)
    @Column(DataType.INTEGER)
    @Index
    questionId!: number;
  
    @Column(DataType.STRING)
    text!: string;
  
    @BelongsTo(() => Questions)
    question!: Questions;
  }
  

  @Table
  export class UserAnswers extends Model<UserAnswers> {
  
    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId!: string;
  
    @PrimaryKey
    @ForeignKey(() => Answers)
    @Column(DataType.INTEGER)
    answerId!: number;
  
    @BelongsTo(() => User)
    user!: User;
  
    @BelongsTo(() => Answers)
    answer!: Answers;
  }