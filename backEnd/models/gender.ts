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
  
  @Table({ timestamps: false })
  export class PrimaryGender extends Model<PrimaryGender> {
  
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
  
    @Column(DataType.STRING)
    text!: string;
  }
  
  @Table({ timestamps: false })
export class SecondaryGender extends Model<SecondaryGender> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => PrimaryGender)
  @Column(DataType.INTEGER)
  primaryGenderId!: number;

  @Column(DataType.STRING)
  text!: string;

  @BelongsTo(() => PrimaryGender)
  primaryGender!: PrimaryGender;
}