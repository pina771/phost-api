import { ConflictException, Injectable } from '@nestjs/common';
import { post, Prisma, user } from '@prisma/client';
import { unlink } from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user-dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto, profilePhotoUrl: string) {
    const dto = { ...createUserDto, profilePhotoUrl: profilePhotoUrl };
    try {
      return await this.prismaService.user.create({ data: dto });
    } catch (e) {
      // NOTE: Ako korisnik već postoji, Prisma baca P2002 error. Potrebno je izbrisati sliku koju je multer automatski spremio.
      // I potrebno je vratiti 409
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == 'P2002') {
          unlink(`uploads/${profilePhotoUrl}`, (err) => {
            if (err) throw err;
            else console.log(`uploads/${profilePhotoUrl} deleted.`);
          });
          throw new ConflictException('Username already exists.');
        }
      }
    }
  }

  async findAll(): Promise<UserDto[]> {
    return await this.prismaService.user.findMany({
      select: {
        userId: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePhotoUrl: true,
        bio: true,
      },
    });
  }

  async findOne(id: number): Promise<UserDto> {
    return await this.prismaService.user.findUnique({
      where: { userId: id },
      select: {
        userId: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePhotoUrl: true,
        bio: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prismaService.user.update({
      where: { userId: id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return await this.prismaService.user.delete({ where: { userId: id } });
  }

  async findOneByUsername(username: string): Promise<UserDto> {
    // TODO:
    return await this.prismaService.user.findUnique({
      where: { username: username },
      select: {
        userId: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePhotoUrl: true,
        bio: true,
      },
    });
  }

  async findOneByUsernameForLogin(username: string): Promise<user> {
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
