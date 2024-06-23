import { IUserProfileUpdateInput } from '@api/my/interface/interface';
import { Authentication, Role } from '@prisma/client';
import { ClassConstructor, plainToInstance } from 'class-transformer';

interface UserProps {
  id?: number;
  role?: Role;
  nickname: string;
  description?: string;
  profileImageKey?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  totalReviewCount?: number;
  ratingAverage?: number;
  authentication?: Authentication;
}

export default class User {
  private _id: number;
  private _role?: Role;
  private _nickname: string;
  private _description?: string;
  private _profileImageKey?: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt?: Date;
  private _totalReviewCount?: number;
  private _ratingAverage?: number;
  private _authentication?: Authentication;

  constructor({
    id = null,
    role = Role.USER,
    nickname,
    description = '',
    profileImageKey,
    createdAt,
    updatedAt,
    deletedAt,
    totalReviewCount,
    ratingAverage,
    authentication,
  }: UserProps) {
    this._id = id;
    this._role = role;
    this._nickname = nickname;
    this._description = description;
    this._profileImageKey = profileImageKey;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
    this._totalReviewCount = totalReviewCount;
    this._ratingAverage = ratingAverage;
    this._authentication = authentication;
  }

  static of(user: UserProps): User {
    return new User(user);
  }

  static create(
    nickname: string,
    description: string,
    profileImageKey?: string,
  ): User {
    return new User({ nickname, description, profileImageKey });
  }

  updateProfile({
    nickname,
    description,
    profileImageKey,
  }: {
    nickname: string;
    description: string;
    profileImageKey?: string;
  }) {
    this._nickname = nickname;
    this._description = description;
    this._profileImageKey = profileImageKey;
  }

  get id() {
    return this._id;
  }

  get allProperties() {
    return {
      id: this._id,
      role: this._role,
      nickname: this._nickname,
      description: this._description,
      profileImageKey: this._profileImageKey,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
      totalReviewCount: this._totalReviewCount,
      ratingAverage: this._ratingAverage,
      authentication: this._authentication,
    };
  }

  get profileUpdateData() {
    return {
      nickname: this._nickname,
      description: this._description,
      profileImageKey: this._profileImageKey,
    };
  }

  get profileSnapshot() {
    return {
      userId: this._id,
      nickname: this._nickname,
      description: this._description,
      profileImageKey: this._profileImageKey,
    };
  }

  get nickname() {
    return this._nickname;
  }

  get profileImageKey() {
    return this._profileImageKey;
  }
}
