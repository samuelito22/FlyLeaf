import { Model, ForeignKey, Column, Table, DataType, PrimaryKey, Unique } from 'sequelize-typescript';
import { User } from './user';

@Table
export class RefreshTokens extends Model<RefreshTokens> {

  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @Unique
  @Column(DataType.STRING)
  token!: string;

  @Column(DataType.DATE)
  issuedAt!: Date;

  @Column(DataType.DATE)
  expiresAt!: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  revoked!: Date | null;

  @Column({ type: DataType.STRING, allowNull: true })
  replacedByToken!: string | null;
}
