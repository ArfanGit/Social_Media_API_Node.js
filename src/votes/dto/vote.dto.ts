import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VoteDto {
  @ApiProperty({
    example: 1,
    description: 'Post ID to vote on',
  })
  @IsInt()
  post_id!: number;

  @ApiProperty({
    example: 1,
    description: 'Direction: 1 to upvote/like, 0 to remove vote',
    enum: [0, 1],
  })
  @IsInt()
  @Min(0)
  @Max(1)
  dir!: number;
}
