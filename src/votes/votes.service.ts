import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VoteDto } from './dto/vote.dto';

@Injectable()
export class VotesService {
  constructor(private prisma: PrismaService) {}

  async vote(voteDto: VoteDto, userId: number): Promise<{ message: string }> {
    // Check if post exists
    const post = await this.prisma.post.findUnique({
      where: { id: voteDto.post_id },
    });

    if (!post) {
      throw new NotFoundException(
        `Post with id: ${voteDto.post_id} does not exist`,
      );
    }

    // Check if vote already exists
    const existingVote = await this.prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: voteDto.post_id,
        },
      },
    });

    if (voteDto.dir === 1) {
      // Upvote/like
      if (existingVote) {
        throw new ConflictException(
          `User ${userId} has already voted on post ${voteDto.post_id}`,
        );
      }

      await this.prisma.vote.create({
        data: {
          userId,
          postId: voteDto.post_id,
        },
      });

      return { message: 'successfully added vote' };
    } else {
      // Remove vote (dir === 0)
      if (!existingVote) {
        throw new NotFoundException('Vote does not exist');
      }

      await this.prisma.vote.delete({
        where: {
          userId_postId: {
            userId,
            postId: voteDto.post_id,
          },
        },
      });

      return { message: 'successfully deleted vote' };
    }
  }
}
