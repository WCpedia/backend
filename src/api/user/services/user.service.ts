import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async checkNicknameUsable(nickname: string): Promise<boolean> {
    return !(await this.userRepository.getUserByNickname(nickname));
  }
}
