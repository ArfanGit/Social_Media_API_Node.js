import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PostWithVotesDto } from './dto/post-with-votes.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, ownerId: number): Promise<PostResponseDto> {
    const post = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        published: createPostDto.published ?? true,
        ownerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    return post;
  }

  async findAll(
    limit: number = 10,
    skip: number = 0,
    search: string = '',
  ): Promise<PostWithVotesDto[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
      take: limit,
      skip,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            createdAt: true,
          },
        },
        votes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map((post) => ({
      Post: {
        id: post.id,
        title: post.title,
        content: post.content,
        published: post.published,
        createdAt: post.createdAt,
        ownerId: post.ownerId,
        owner: post.owner,
      },
      votes: post.votes.length,
    }));
  }

  async findOne(id: number): Promise<PostWithVotesDto> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            createdAt: true,
          },
        },
        votes: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with id: ${id} does not exist`);
    }

    return {
      Post: {
        id: post.id,
        title: post.title,
        content: post.content,
        published: post.published,
        createdAt: post.createdAt,
        ownerId: post.ownerId,
        owner: post.owner,
      },
      votes: post.votes.length,
    };
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<PostResponseDto> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with id: ${id} does not exist`);
    }

    if (post.ownerId !== userId) {
      throw new ForbiddenException('Not authorized to perform requested action');
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    return updatedPost;
  }

  async remove(id: number, userId: number): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with id: ${id} does not exist`);
    }

    if (post.ownerId !== userId) {
      throw new ForbiddenException('Not authorized to perform requested action');
    }

    await this.prisma.post.delete({
      where: { id },
    });
  }
}
