import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: number, photoUrl: string) {
    const dto = { ...createPostDto, userId: userId, photoUrl: photoUrl };
    return await this.prismaService.post.create({ data: dto });
  }

  async findAll() {
    return await this.prismaService.post.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.post.findUnique({ where: { postId: id } });
  }

  async update(postId: number, userId: number, updatePostDto: UpdatePostDto) {
    const post = await this.prismaService.post.findUnique({
      where: { postId: postId },
    });
    if (post.userId !== userId)
      throw new UnauthorizedException('You can edit only your posts.');

    return await this.prismaService.post.update({
      where: { postId: postId },
      data: updatePostDto,
    });
  }

  async remove(postId: number, userId: number) {
    const post = await this.prismaService.post.findUnique({
      where: { postId: postId },
    });
    if (post.userId !== userId)
      throw new UnauthorizedException('You can only delete your own posts.');
    return await this.prismaService.post.delete({ where: { postId: postId } });
  }
}
