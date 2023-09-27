import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    AutoIncrement
  } from 'sequelize-typescript';
import { User } from './user';

@Table
export class SubscriptionFeatures extends Model<SubscriptionFeatures> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  featureName!: string;

  @Column(DataType.STRING)
  description!: string;
}

  @Table
  export class UserSubscriptionFeatures extends Model<UserSubscriptionFeatures> {
  
    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId!: string;
  
    @PrimaryKey
    @ForeignKey(() => SubscriptionFeatures)
    @Column(DataType.INTEGER)
    featureId!: number;
  
    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    isActive!: boolean;
  
    @BelongsTo(() => User)
    user!: User;
  
    @BelongsTo(() => SubscriptionFeatures)
    subscriptionFeature!: SubscriptionFeatures;
  }
  

@Table
export class SubscriptionPackages extends Model<SubscriptionPackages> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.FLOAT)
  price!: number;

  @Column(DataType.INTEGER)
  durationDays!: number;
}

@Table
export class PackageFeatures extends Model<PackageFeatures> {

  @PrimaryKey
  @ForeignKey(() => SubscriptionPackages)
  @Column(DataType.INTEGER)
  packageId!: number;

  @PrimaryKey
  @ForeignKey(() => SubscriptionFeatures)
  @Column(DataType.INTEGER)
  featureId!: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;
}

@Table
export class UserSubscriptions extends Model<UserSubscriptions> {

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @ForeignKey(() => SubscriptionPackages)
  @Column(DataType.INTEGER)
  packageId!: number;

  @Column(DataType.DATE)
  startDate!: Date;

  @Column(DataType.DATE)
  endDate!: Date;
}