import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'My First Post',
    description: 'Post title',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    example: 'This is the content of my post...',
    description: 'Post content',
  })
  @IsString()
  content!: string;

  @ApiProperty({
    example: true,
    description: 'Whether the post is published',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
