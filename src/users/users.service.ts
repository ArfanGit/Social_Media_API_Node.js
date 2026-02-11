import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate username from email by extracting the part before @ and removing dots
   * Example: john.doe@example.com -> johndoe
   * If username exists, append number: johndoe, johndoe1, johndoe2, etc.
   */
  private async generateUsernameFromEmail(email: string): Promise<string> {
    const baseUsername = email.split('@')[0].replace(/\./g, '').toLowerCase();
    let username = baseUsername;
    let counter = 1;

    // Check if username exists, if so append number
    while (true) {
      const existing = await this.prisma.user.findUnique({
        where: { username },
      });

      if (!existing) {
        break; // Username is available
      }

      username = `${baseUsername}${counter}`;
      counter++;
    }

    return username;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const username = await this.generateUsernameFromEmail(createUserDto.email);

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        username,
        role: createUserDto.role === 'donor' ? UserRole.DONOR : UserRole.RECEIVER,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      ...user,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      username: user.username ?? undefined,
      role: user.role === UserRole.DONOR ? 'donor' : 'receiver',
    };
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} does not exist`);
    }

    return {
      ...user,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      username: user.username ?? undefined,
      role: user.role === UserRole.DONOR ? 'donor' : 'receiver',
    };
  }

  async updateMe(userId: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${userId} does not exist`);
    }

    // If email is being updated, ensure it's unique
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existing) {
        throw new BadRequestException('Email is already in use');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: updateUserDto.email ?? user.email,
        firstName: updateUserDto.firstName ?? user.firstName,
        lastName: updateUserDto.lastName ?? user.lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      ...updated,
      firstName: updated.firstName ?? undefined,
      lastName: updated.lastName ?? undefined,
      username: updated.username ?? undefined,
      role: updated.role === UserRole.DONOR ? 'donor' : 'receiver',
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${userId} does not exist`);
    }

    const isCurrentValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isCurrentValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }

    const hashed = await bcrypt.hash(changePasswordDto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashed,
      },
    });
  }

  async deleteMe(userId: number, deleteAccountDto: DeleteAccountDto): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${userId} does not exist`);
    }

    const isPasswordValid = await bcrypt.compare(deleteAccountDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
