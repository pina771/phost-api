import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  Request,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from './dto/user-dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description:
      'Upon succesful registration, the API will return a 201 Created status code\
  , after which it will be possible to log-in with the given parameters.',
  })
  @ApiResponse({
    status: 409,
    description:
      "If a username already exists, the API will return a\
  409 with the message 'Username already exists'.",
  })
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (file) {
      return await this.usersService.create(createUserDto, file.filename);
    } else
      return await this.usersService.create(createUserDto, 'default_photo.jpg');
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: UserDto,
    isArray: true,
    description:
      'Returns an array of UserDtos that contain general information about the users.',
  })
  async findAll(): Promise<UserDto[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: UserDto,
    description:
      'Returns the general info (UserDto) about the user specified in the parameter.',
  })
  async findOne(@Param('id') id: string, @Request() req) {
    return await this.usersService.findOne(+id);
  }

  // TODO: Image reupload
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Specifies upon which user the PATCH method will be executed',
  })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    if (req.user.userId !== id) throw new UnauthorizedException();
    return await this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // TODO: Post Dto
  @ApiResponse({
    status: 200,
    description: 'Returns all posts of the user defined by the parameter.',
  })
  @Get(':id/posts')
  async getAllPostsFromUser(@Param('id') id: string) {
    return await this.usersService.findAllPostsFromUser(+id);
  }
}
