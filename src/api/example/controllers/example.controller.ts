import { DOMAIN_NAME } from '@enums/domain-name.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ExampleService } from '../services/example.service';
import { ApiExample } from './swagger/example.swagger';
import { BasicUserDto } from '@dtos/common/basic-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../dtos/response/user.dto';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { PostWithUserDto } from '../dtos/response/post-with-user.dto';

@Controller(DOMAIN_NAME.EXAMPLE)
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @ApiExample.ExampleGetUserList({ summary: '유저 목록 조회' })
  @Get()
  async exampleGetUserList(): Promise<BasicUserDto[]> {
    const userList: BasicUserDto[] = await this.exampleService.getUserList();

    return plainToInstance(BasicUserDto, userList);
  }

  @ApiExample.ExampleGetUser({ summary: '특정 유저 조회' })
  @Get(':userId')
  async exampleGetUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserDto> {
    return this.exampleService.getUser(userId);
  }

  @ApiExample.ExampleCreateUser({ summary: '유저 생성' })
  @Post()
  async exampleCreateUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.exampleService.createUser(createUserDto);
  }

  @ApiExample.ExampleUpdateUser({ summary: '유저 수정' })
  @Patch(':userId')
  async exampleUpdateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    return this.exampleService.updateUser(userId, updateUserDto);
  }

  @ApiExample.ExampleDeleteUser({ summary: '유저 삭제 (소프트 딜리트)' })
  @Delete(':userId')
  async exampleDeleteUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    return this.exampleService.deleteUser(userId);
  }

  @ApiExample.ExampleGetPost({ summary: '게시글 조회' })
  @Get('posts/:postId')
  async exampleGetPost(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<PostWithUserDto> {
    return this.exampleService.getPost(userId);
  }
}
