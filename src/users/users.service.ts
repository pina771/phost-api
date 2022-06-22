import { Injectable } from '@nestjs/common';
import { post, user } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.prismaService.user.create({ data: createUserDto });
  }

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.user.findUnique({
      where: { userId: id },
    });
  }

  // TODO: Image upload!
  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prismaService.user.update({
      where: { userId: id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return await this.prismaService.user.delete({ where: { userId: id } });
  }

  async findOneByUsername(username: string): Promise<user> {
    return await this.prismaService.user.findUnique({
      where: { username: username },
    });
  }

  async findAllPostsFromUser(id: number): Promise<post[]> {
    const user = await this.prismaService.user.findUnique({
      where: { userId: id },
      include: { posts: true },
    });
    return user.posts;
  }
}
