import { Model, ForeignKey, Column, Table, DataType, PrimaryKey, AutoIncrement, Index } from 'sequelize-typescript';
import { User } from './user';

@Table
export class SpotifyTokens extends Model<SpotifyTokens> {

  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @Column(DataType.STRING)
  accessToken!: string;

  @Column(DataType.STRING)
  refreshToken!: string;

  @Column(DataType.DATE)
  tokenExpiration!: Date;
}


@Table
export class TopArtists extends Model<TopArtists> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  artistName!: string;

  @Column(DataType.STRING)
  @Index
  artistSpotifyId!: string;

  @Column(DataType.STRING)
  imageUrl!: string;
}

@Table
export class UserTopArtists extends Model<UserTopArtists> {

  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @PrimaryKey
  @ForeignKey(() => TopArtists)
  @Column(DataType.INTEGER)
  artistId!: number;

  @Column(DataType.INTEGER)
  rank!: number;
}