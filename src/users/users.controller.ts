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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    /* TODO: Search by username */
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return await this.usersService.findOne(+id);
  }

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

  @ApiBearerAuth('test')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get(':id/posts')
  async getAllPostsFromUser(@Param('id') id: string) {
    return await this.usersService.findAllPostsFromUser(+id);
  }
}
