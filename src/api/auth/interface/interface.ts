export interface IKakaoUserProfile {
  id: number;
  connected_at: string;
  for_partner: {
    uuid: string;
  };
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    profile_needs_agreement: boolean;
    profile: {
      nickname: string;
      thumbnail_image_url: string;
      profile_image_url: string;
      is_default_image: boolean;
    };
    has_email: boolean;
    email_needs_agreement: boolean;
    is_email_valid: boolean;
    is_email_verified: boolean;
    email: string;
    has_phone_number: boolean;
    phone_number_needs_agreement: boolean;
    phone_number: string;
    is_kakaotalk_user: boolean;
  };
}

export interface INaverUserProfile {
  resultcode?: string;
  message?: string;
  response?: {
    id?: string;
    email?: string;
    name?: string;
  };
}

export interface IGoogleUserProfile {
  id?: string;
  email?: string;
  verified_email?: boolean;
  picture?: string;
}

export interface IUserAuth {
  userId?: number;
  provider?: string;
  userEmail?: string;
  role?: string;
}

export interface IToken {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenPayload {
  userId: number;
  role: string;
  iat: number;
  exp: number;
}

export interface IAuthorizedUser {
  userId: number;
  role: string;
}
