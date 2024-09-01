import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe' })
    @IsNotEmpty()
    name: string;
  
    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email: string;
  
    @ApiProperty({ example: 'strongpassword123' })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    role?: any;
}
