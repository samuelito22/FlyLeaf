import { Model, Column, Table, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table
export class Ads extends Model<Ads> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  imageUrl!: string;

  @Column(DataType.STRING)
  link!: string;

  @Column(DataType.DATE)
  startDate!: Date;

  @Column(DataType.DATE)
  endDate!: Date;

  // This assumes you have a specific way to serialize and deserialize array data into the database.
  // PostgreSQL supports array data types natively, but some other databases might not.
  @Column(DataType.ARRAY(DataType.STRING))
  targetDemographic!: string[];
}
