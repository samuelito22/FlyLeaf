import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement
  } from 'sequelize-typescript';
  
  @Table({ timestamps: false })
  export class RelationshipGoal extends Model<RelationshipGoal> {
  
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
  
    @Column(DataType.STRING)
    text!: string;
  }
  