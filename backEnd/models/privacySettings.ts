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
  export class PrivacySettings extends Model<PrivacySettings> {
  
    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId!: string;
  
    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    showOnlineStatus!: boolean;
  
    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    showLastActive!: boolean;
  
    @BelongsTo(() => User)
    user!: User;
  }
  