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
import { RelationshipGoal } from './relationshipGoal';
  
  @Table
  export class FilterSettings extends Model<FilterSettings> {
  
    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId!: string;
  
    @ForeignKey(() => RelationshipGoal)
    @Column(DataType.INTEGER)
    relationshipGoalId!: number;
  
    @Column({ type: DataType.INTEGER, defaultValue: 100 })
    ageMax!: number;
  
    @Column({ type: DataType.INTEGER, defaultValue: 18 })
    ageMin!: number;
  
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    global!: boolean;
  
    @Column({ type: DataType.INTEGER, defaultValue: 50 })
    distanceRadius!: number;
  
    @Column({ type: DataType.INTEGER, defaultValue: 2 })
    minPhotosRequired!: number;
  
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    showVerifiedProfilesOnly!: boolean;
  
    @BelongsTo(() => User)
    user!: User;
  
    @BelongsTo(() => RelationshipGoal)
    relationshipGoalDetail!: RelationshipGoal;
  }
  