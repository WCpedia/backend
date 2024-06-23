export interface IUserProfileUpdateInput {
  nickname?: string;
  description?: string;
  profileImageKey?: string;
}

export interface IUserProfileSnapshotInput {
  nickname: string;
  description: string;
  profileImageKey: string;
}
