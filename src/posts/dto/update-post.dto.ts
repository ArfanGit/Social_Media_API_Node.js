import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({
    example: 'Updated Post Title',
    description: 'Post title',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Updated content...',
    description: 'Post content',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    example: false,
    description: 'Whether the post is published',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
