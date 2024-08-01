import { Controller, Get, UseGuards } from '@nestjs/common';
import { DOMAIN_NAME } from '@src/constants/consts/domain-name.const ';
import { BlockService } from '../services/block.service';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';
import { IAuthorizedUser } from '@api/auth/interface/interface';
import { ApiBlock } from '../swaggers/block.swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(DOMAIN_NAME.BLOCK)
@Controller(DOMAIN_NAME.BLOCK)
@UseGuards(AccessTokenGuard)
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @ApiBlock.GetBlockUserIds({ summary: '차단한 유저 아이디 목록 조회' })
  @Get('/user-ids')
  async getBlockUserIds(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
  ): Promise<number[]> {
    return this.blockService.getBlockUserIds(authorizedUser.userId);
  }
}
