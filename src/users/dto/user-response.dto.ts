import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id!: number;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email!: string;

  @ApiProperty({ example: 'John', description: 'User first name', required: false })
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'User last name', required: false })
  lastName?: string;

  @ApiProperty({ example: 'johndoe', description: 'User username (read-only)', required: false })
  username?: string;

  @ApiProperty({
    example: 'donor',
    description: 'User role / type (immutable)',
    enum: ['donor', 'receiver'],
  })
  role!: 'donor' | 'receiver';

  @ApiProperty({ example: '2026-02-07T08:00:00.000Z', description: 'User creation date' })
  createdAt!: Date;
}
