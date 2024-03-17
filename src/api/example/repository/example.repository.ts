import { Injectable } from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { UpdateUserDto } from '../dtos/request/update-user.dto';

@Injectable()
export class ExampleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUser(userId: number): Promise<User> {
    return await this.prismaService.user.findFirst({
      where: { id: userId, deletedAt: null },
    });
  }

  async getUsers(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async createUser(userInputData: CreateUserDto): Promise<void> {
    await this.prismaService.user.create({ data: userInputData });
  }

  async updateUser(userId: any, userUpdateData: UpdateUserDto): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: userUpdateData,
    });
  }

  async deleteUser(userId: number): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
  }

  async getPost(postId: number): Promise<Post & { user: User }> {
    return this.prismaService.post.findUnique({
      where: { id: postId },
      include: { user: true },
    });
  }
}
