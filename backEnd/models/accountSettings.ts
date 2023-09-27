import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo
  } from 'sequelize-typescript';
import { User } from './user';
  
  @Table
  export class AccountSettings extends Model<AccountSettings> {
  
    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId!: string;
  
    // Using PostgreSQL's array data type
    @Column(DataType.ARRAY(DataType.INTEGER))
    deactivateAccountAfterInactivity!: number[];
  
    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    discoverable!: boolean;
  
    @BelongsTo(() => User)
    user!: User;
  }
  