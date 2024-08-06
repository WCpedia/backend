import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DOMAIN_NAME } from '@src/constants/consts/domain-name.const ';
import { BlockService } from '../services/block.service';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';
import { IAuthorizedUser } from '@api/auth/interface/interface';
import { ApiBlock } from '../swaggers/block.swagger';
import { ApiTags } from '@nestjs/swagger';
import { BasicUserDto } from '@api/common/dto/basic-user.dto';
import PaginationDto from '@api/common/dto/pagination.dto';
import { PaginatedResponse } from '@api/common/interfaces/interface';

@ApiTags(DOMAIN_NAME.BLOCK)
@Controller(DOMAIN_NAME.BLOCK)
@UseGuards(AccessTokenGuard)
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @ApiBlock.CreateBlock({ summary: '유저 차단 생성' })
  @Post('/:targetUserId')
  async createBlock(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Param('targetUserId', ParseIntPipe) targetUserId: number,
  ): Promise<void> {
    await this.blockService.createBlock(authorizedUser.userId, targetUserId);
  }

  @ApiBlock.GetBlockUserIds({ summary: '차단한 유저 아이디 목록 조회' })
  @Get('/user-ids')
  async getBlockUserIds(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
  ): Promise<number[]> {
    return this.blockService.getBlockUserIds(authorizedUser.userId);
  }

  @ApiBlock.GetBlockUserProfiles({ summary: '차단한 유저 프로필 목록 조회' })
  @Get('/profiles')
  async getBlockUserProfiles(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<BasicUserDto, 'blockedUserProfiles'>> {
    return this.blockService.getBlockUserProfiles(
      authorizedUser.userId,
      paginationDto,
    );
  }

  @ApiBlock.DeleteBlock({ summary: '차단 해제' })
  @Delete('/:blockedUserId')
  async deleteBlock(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Param('blockedUserId', ParseIntPipe) blockedUserId: number,
  ): Promise<void> {
    await this.blockService.deleteBlock(authorizedUser.userId, blockedUserId);
  }
}
