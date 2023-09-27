import { Model, ForeignKey, Column, Table, DataType, PrimaryKey } from 'sequelize-typescript';
import { User } from './user';

@Table
export class DeviceInfo extends Model<DeviceInfo> {

  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @Column(DataType.STRING)
  deviceId!: string;

  @Column(DataType.STRING)
  deviceType!: string; // e.g., "Android", "iOS", "Web"
}
