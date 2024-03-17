import { Injectable } from '@nestjs/common';
import { ExampleRepository } from '../repository/example.repository';
import { User } from '@prisma/client';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { BasicUserDto } from '../../../dtos/common/basic-user.dto';
import { UserDto } from '../dtos/response/user.dto';
import { PostWithUserDto } from '../dtos/response/post-with-user.dto';

@Injectable()
export class ExampleService {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async getUser(userId: number): Promise<User> {
    const selectedUser = await this.exampleRepository.getUser(userId);
    console.log('ExampleService_1.exampleGetUser');

    return new UserDto(selectedUser);
  }

  async getUserList(): Promise<BasicUserDto[]> {
    console.log('ExampleService_1.exampleGetUserList');

    return await this.exampleRepository.getUsers();
  }

  async createUser(dto: CreateUserDto): Promise<void> {
    console.log('ExampleService_1.exampleCreateUser');
    await this.exampleRepository.createUser(dto);
  }

  async updateUser(userId: number, dto: UpdateUserDto): Promise<void> {
    console.log('ExampleService_1.exampleUpdateUser');
    await this.exampleRepository.updateUser('asdasd', dto);
  }

  async deleteUser(userId: number): Promise<void> {
    console.log('ExampleService_1.exampleDeleteUser');
    await this.exampleRepository.deleteUser(userId);
  }

  async getPost(postId: number): Promise<PostWithUserDto> {
    const selectedPost = await this.exampleRepository.getPost(postId);

    return new PostWithUserDto(selectedPost);
  }
}
