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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { post } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file.filename);

    return this.postsService.create(
      createPostDto,
      +req.user.userId,
      file.filename,
    );
  }

  @Get()
  async findAll(): Promise<post[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<post> {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description:
      'Upon success, changes the post description and returns the updated post',
  })
  @ApiParam({ name: 'id', description: 'Defines the post which is updated' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
