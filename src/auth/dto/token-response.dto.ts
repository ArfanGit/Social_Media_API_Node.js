import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE3MDcyMjQ4MDAsImV4cCI6MTcwNzIyNjYwMH0.example',
    description: 'JWT access token',
  })
  access_token!: string;

  @ApiProperty({ example: 'bearer', description: 'Token type' })
  token_type!: string;
}
