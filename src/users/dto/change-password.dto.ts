import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'currentPassword123',
    description: 'Current password',
  })
  @IsString()
  currentPassword!: string;

  @ApiProperty({
    example: 'newPassword123!',
    description: 'New password (min 8 chars, at least one letter, one number, one special character)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/, {
    message: 'Password must contain at least one letter, one number, and one special character',
  })
  newPassword!: string;

  @ApiProperty({
    example: 'newPassword123!',
    description: 'Confirm new password (must match newPassword)',
  })
  @IsString()
  confirmPassword!: string;
}
