import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { post } from '@prisma/client';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, +req.user.userId);
  }

  @Get()
  async findAll(): Promise<post[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<post> {
    return this.postsService.findOne(+id);
  }

  @ApiResponse({
    status: 200,
    description:
      'Upon success, changes the post description and returns the updated post',
  })
  @ApiParam({ name: 'id', description: 'Defines the post which is updated' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    return await this.postsService.update(+id, +req.user.userId, updatePostDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Upon successful deletion returns the deleted post.',
  })
  @ApiResponse({
    status: 401,
    description:
      'If not authorized, returns a 401 status code without performing anything.',
  })
  @ApiParam({
    name: 'id',
    description: 'Defines the post which is to be deleted',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<post> {
    return await this.postsService.remove(+id, +req.user.userId);
  }
}
