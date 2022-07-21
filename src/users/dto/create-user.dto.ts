import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({
    name: 'image',
    type: 'file',
    format: 'jpg,png,jpeg',
    required: false,
    description:
      'Profile photo image in specified format. If not provided, a generic avatar photo will be used.',
  })
  image?: any;
}
