import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteAccountDto {
  @ApiProperty({
    example: 'password@123',
    description: 'Current password to confirm account deletion',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password!: string;
}

