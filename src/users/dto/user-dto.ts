import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UserDto {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty({
    description:
      'Contains the name of the profile photo in the /uploads folder.',
  })
  profilePhotoUrl: string;
  @ApiProperty()
  bio: string;
}
