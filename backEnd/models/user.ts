// models/User.ts

import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, CreatedAt, HasOne, HasMany, Index } from 'sequelize-typescript';
import { NotificationSettings } from './notificationSettings';
import { FilterSettings } from './filterSettings';
import { PrivacySettings } from './privacySettings';
import { PrimaryGender, SecondaryGender } from './gender';
import { AccountSettings } from './accountSettings';
import { UserSubscriptionFeatures, UserSubscriptions } from './subscription';
import { UserLanguages } from './languages';
import { UserInterests } from './interests';
import { UserAnswers } from './questionAndAnswer';
import { UserMatches } from './userMatches';
import { UserPictures } from './userPictures';
import { Conversations } from './conversations';
import { Payments } from './payments';
import { NotificationsHistory } from './notificationHistory';
import { UserReportedIssues } from './userReportedIssues';
import { UserBlocked } from './userBlocked';
import { DeviceInfo } from './deviceInfo';
import { RefreshTokens } from './refreshTokens';
import { SpotifyTokens, UserTopArtists } from './spotify';
import { InstagramImages, InstagramTokens } from './instagram';
import { UserFeedback } from './userFeedback';
import { UUIDV4 } from 'sequelize';
import { UserSeekingGender } from './userSeekingGender';

@Table
export class User extends Model<User> {

  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: UUIDV4
  })
  id!: string;

  @Column(DataType.STRING)
  firstName!: string;

  @Column(DataType.DATE)
  dateOfBirth!: Date;

  @ForeignKey(() => PrimaryGender)
  @Column(DataType.INTEGER)
  primaryGenderId!: number;

  @ForeignKey(() => SecondaryGender)
  @Column(DataType.INTEGER)
  secondaryGenderId?: number;

  @Column(DataType.STRING)
  bio?: string;

  @Column(DataType.FLOAT)
  height?: number;

  @Column({ type: DataType.STRING, unique: true })
  email?: string;

  @Column({ type: DataType.STRING, unique: true })
  phoneNumber?: string;

  @Column(DataType.STRING)
  city?: string;

  @Column(DataType.FLOAT)
  longitude!: number;

  @Column(DataType.FLOAT)
  latitude!: number;

  @Column(DataType.BOOLEAN)
  verified: boolean = false

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;


    // Relationships:

  // Assuming you have Primary_Gender and Secondary_Gender models:
  @BelongsTo(() => PrimaryGender)
  primaryGender!: PrimaryGender;

  @BelongsTo(() => SecondaryGender)
  secondaryGender?: SecondaryGender;

  // Notification_Settings
  @HasOne(() => NotificationSettings)
  notificationSettings!: NotificationSettings;

  // Filter_Settings
  @HasOne(() => FilterSettings)
  filterSettings!: FilterSettings;

  // Privacy_Settings
  @HasOne(() => PrivacySettings)
  privacySettings!: PrivacySettings;

  // Account_Settings
  @HasOne(() => AccountSettings)
  accountSettings!: AccountSettings;

  // User_Subscription_Features
  @HasMany(() => UserSubscriptionFeatures)
  subscriptionFeatures?: UserSubscriptionFeatures[];

  // User_Languages
  @HasMany(() => UserLanguages)
  languages?: UserLanguages[];

  // User_Interests
  @HasMany(() => UserInterests)
  interests!: UserInterests[];

  // User_Answers
  @HasMany(() => UserAnswers)
  answers!: UserAnswers[];

  // User_Matches (where the user is the main user)
  @HasMany(() => UserMatches, {foreignKey: 'user_id'})
  matches?: UserMatches[];

  // User_Matches (where the user is the matched user)
  @HasMany(() => UserMatches, {foreignKey: 'matched_user_id'})
  matchedBy?: UserMatches[];

  // User_Pictures
  @HasMany(() => UserPictures)
  pictures!: UserPictures[];

  // Conversations (where the user is user1)
  @HasMany(() => Conversations, {foreignKey: 'user1_id'})
  conversationsInitiated?: Conversations[];

  // Conversations (where the user is user2)
  @HasMany(() => Conversations, {foreignKey: 'user2_id'})
  conversationsReceived?: Conversations[];

  // Payments
  @HasMany(() => Payments)
  payments?: Payments[];

  // Notifications_History
  @HasMany(() => NotificationsHistory)
  notificationHistory?: NotificationsHistory[];

  // User_Reported_Issues (where the user is the reporter)
  @HasMany(() => UserReportedIssues, {foreignKey: 'reporter_id'})
  reportedIssues?: UserReportedIssues[];

  // User_Blocked (users this user has blocked)
  @HasMany(() => UserBlocked, {foreignKey: 'user_id'})
  blockedUsers?: UserBlocked[];

  // Device_Info
  @HasOne(() => DeviceInfo)
  deviceInfo!: DeviceInfo;

  // Refresh_Tokens
  @HasOne(() => RefreshTokens)
  refreshToken!: RefreshTokens;

  // SpotifyTokens
  @HasOne(() => SpotifyTokens)
  spotifyTokens?: SpotifyTokens;

  // User_Top_Artists
  @HasMany(() => UserTopArtists)
  topArtists?: UserTopArtists[];

  // InstagramTokens
  @HasOne(() => InstagramTokens)
  instagramTokens?: InstagramTokens;

  // InstagramImages
  @HasMany(() => InstagramImages)
  instagramImages?: InstagramImages[];

  // User_Feedback
  @HasMany(() => UserFeedback)
  feedback?: UserFeedback[];

  // User_Subscriptions
  @HasMany(() => UserSubscriptions)
  subscriptions?: UserSubscriptions[];

  // User_Seeking_Gender
  @HasMany(() => UserSeekingGender)
  seeking!: UserSeekingGender[];
}
