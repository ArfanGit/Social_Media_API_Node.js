import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { VoteDto } from './dto/vote.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserResponseDto } from '../users/dto/user-response.dto';

@ApiTags('votes')
@Controller('vote')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Vote on a post (like/unlike)' })
  @ApiResponse({
    status: 201,
    description: 'Vote successfully added or removed',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'successfully added vote',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found or vote does not exist' })
  @ApiResponse({ status: 409, description: 'Conflict - user has already voted' })
  async vote(
    @Body() voteDto: VoteDto,
    @CurrentUser() user: UserResponseDto,
  ): Promise<{ message: string }> {
    return this.votesService.vote(voteDto, user.id);
  }
}
