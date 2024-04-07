import { Injectable } from '@nestjs/common';
import { MyRepository } from '../repository/my.repository';
import { BasicUserDto } from '@api/common/dto/basic-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MyService {
  constructor(private readonly myRepository: MyRepository) {}

  async getMyBasicProfile(userId: number): Promise<BasicUserDto> {
    const user = await this.myRepository.getUserByUserId(userId);

    return plainToInstance(BasicUserDto, user);
  }
}
