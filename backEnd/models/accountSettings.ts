import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    Index
  } from 'sequelize-typescript';
import { User } from './user';
  
  @Table
  export class AccountSettings extends Model<AccountSettings> {
  
    @PrimaryKey
    @Index
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId!: string;
  
    // Using PostgreSQL's array data type
    @Column(DataType.ARRAY(DataType.INTEGER))
    deactivateAccountAfterInactivity!: number[];
  
    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    discoverable!: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    distanceInKm!: boolean;
  
    @BelongsTo(() => User)
    user!: User;
  }
  