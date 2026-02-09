import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from './post-response.dto';

export class PostWithVotesDto {
  @ApiProperty({ type: PostResponseDto, description: 'Post data' })
  Post!: PostResponseDto;

  @ApiProperty({ example: 5, description: 'Number of votes/likes' })
  votes!: number;
}
