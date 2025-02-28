import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  fullName: string;

  @ApiProperty({
    description: 'Unique username (letters, numbers, and underscores allowed)',
    example: 'john_doe123',
  })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(20, { message: 'Username must not exceed 20 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Phone number (digits only, 10-15 characters)',
    example: '1234567890',
  })
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
  @MinLength(10, { message: 'Phone number must be at least 10 digits long' })
  @MaxLength(15, { message: 'Phone number must not exceed 15 digits' })
  phone: string;

  @ApiProperty({
    description:
      'User password (minimum 8 characters, must include at least one uppercase letter, one number, and one special character)',
    example: 'StrongP@ss123',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must include at least one uppercase letter, one number, and one special character',
  })
  password: string;
}
