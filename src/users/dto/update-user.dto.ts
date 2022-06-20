import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  @ApiProperty({ description: 'Only passwords are allowed to change.' })
  password: string;
}
