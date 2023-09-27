import { User } from "./user";
import { AccountSettings } from "./accountSettings";
import { PrivacySettings } from "./privacySettings";
import { FilterSettings } from "./filterSettings";
import { UserInterests, Interests, InterestsCategory } from "./interests";
import { NotificationSettings } from "./notificationSettings";
import { UserAnswers, Answers, Questions } from "./questionAndAnswer";
import { UserLanguages, Languages } from "./languages";
import { RefreshTokens } from "./refreshTokens";
import { UserPictures } from "./userPictures";
import { Conversations } from "./conversations"
import { DeviceInfo } from "./deviceInfo";
import { InstagramImages, InstagramTokens } from "./instagram";
import { Messages } from "./messages";
import { NotificationsHistory } from "./notificationHistory";
import { Payments } from "./payments";
import { SpotifyTokens, UserTopArtists, TopArtists } from "./spotify";
import { UserSubscriptions, UserSubscriptionFeatures, SubscriptionFeatures, SubscriptionPackages } from "./subscription"
import { UserBlocked } from "./userBlocked";
import { UserMatches } from "./userMatches";
import { UserSeekingGender } from "./userSeekingGender";
import { PhoneNumberOTP } from "./phoneNumberOTP"
import {AuthCode } from "./authCode.model"
import { EmailToken } from "./emailToken.model";
import { PrimaryGender, SecondaryGender } from "./gender";
import { UserReportedIssues } from "./userReportedIssues";
import { UserFeedback } from "./userFeedback";
import { RelationshipGoal } from "./relationshipGoal";

const Model = {
    RelationshipGoal,
    UserFeedback,
    UserReportedIssues,
    SubscriptionFeatures,
    SubscriptionPackages,
    UserSubscriptionFeatures,
    InterestsCategory,
    TopArtists,
    PrimaryGender, 
    SecondaryGender,
    Questions,
    Interests,
    Languages,
    User,
    AccountSettings,
    PrivacySettings,
    FilterSettings,
    UserInterests,
    NotificationSettings,
    UserAnswers,
    UserLanguages,
    Answers,
    RefreshTokens,
    UserPictures,
    Conversations,
    DeviceInfo,
    InstagramImages,
    InstagramTokens,
    Messages,
    NotificationsHistory,
    Payments,
    SpotifyTokens,
    UserTopArtists,
    UserSubscriptions,
    UserBlocked,
    UserMatches,
    UserSeekingGender,
    PhoneNumberOTP,
    AuthCode,
    EmailToken
}
export default Model