import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ maxLength: 220 })
  title: string;
  @ApiProperty()
  description?: string;
  @ApiProperty({ name: 'image', type: 'file', format: 'jpg,png,jpeg' })
  image: any;
}
