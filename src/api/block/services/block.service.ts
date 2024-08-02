import { Injectable } from '@nestjs/common';
import { BlockRepository } from '../repository/block.repository';
import { BasicUserDto } from '@api/common/dto/basic-user.dto';
import { plainToInstance } from 'class-transformer';
import PaginationDto from '@api/common/dto/pagination.dto';
import { generatePaginationParams } from '@src/utils/pagination-params-generator';
import { PaginatedResponse } from '@api/common/interfaces/interface';

@Injectable()
export class BlockService {
  constructor(private readonly blockRepository: BlockRepository) {}

  async getBlockUserIds(userId: number): Promise<number[]> {
    const blockUserIds = await this.blockRepository.getBlockedUserIds(userId);

    return blockUserIds.map((block) => block.blockedUserId);
  }

  async getBlockUserProfiles(
    userId: number,
    dto: PaginationDto,
  ): Promise<PaginatedResponse<BasicUserDto, 'blockedUserProfiles'>> {
    const paginationParams = generatePaginationParams(dto);

    const totalItemCount = await this.blockRepository.countBlocks(userId);
    if (totalItemCount === 0) {
      return { totalItemCount, blockedUserProfiles: [] };
    }

    const blocks = await this.blockRepository.getBlockedUserProfiles(
      userId,
      paginationParams,
    );

    return {
      totalItemCount,
      blockedUserProfiles: blocks.map((block) =>
        plainToInstance(BasicUserDto, block.blockedUser),
      ),
    };
  }
}
