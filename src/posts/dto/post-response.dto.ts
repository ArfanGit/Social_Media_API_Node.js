import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class PostResponseDto {
  @ApiProperty({ example: 1, description: 'Post ID' })
  id!: number;

  @ApiProperty({ example: 'My First Post', description: 'Post title' })
  title!: string;

  @ApiProperty({ example: 'This is the content...', description: 'Post content' })
  content!: string;

  @ApiProperty({ example: true, description: 'Whether the post is published' })
  published!: boolean;

  @ApiProperty({ example: '2026-02-07T08:00:00.000Z', description: 'Post creation date' })
  createdAt!: Date;

  @ApiProperty({ example: 1, description: 'Owner user ID' })
  ownerId!: number;

  @ApiProperty({ type: UserResponseDto, description: 'Post owner' })
  owner!: UserResponseDto;
}
