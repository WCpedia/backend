import { Injectable } from '@nestjs/common';
import { BlockRepository } from '../repository/block.repository';

@Injectable()
export class BlockService {
  constructor(private readonly blockRepository: BlockRepository) {}

  async getBlockUserIds(userId: number): Promise<number[]> {
    const blockUserIds = await this.blockRepository.getBlockedUserIds(userId);

    return blockUserIds.map((block) => block.blockedUserId);
  }
}
