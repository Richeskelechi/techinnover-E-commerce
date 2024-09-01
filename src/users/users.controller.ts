import { Controller, Post, Patch, Body, Get, UseGuards, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: User })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    const newUser = await  this.userService.register(createUserDto);
    return {statusCode: HttpStatus.CREATED, msg: "User created successfully", data: newUser}
  }

  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'Login successful.', type: User })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    const loggedInUser = await this.userService.login(loginUserDto);
    return {statusCode: HttpStatus.OK, msg: "User logged in successfully", data: loggedInUser}
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth() // Specify Bearer token is required
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all users', type: [User] })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit of items per page', example: 10 })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const paginatedUsers = await this.userService.findAllUsers({ page, limit });
    return { statusCode: HttpStatus.OK, msg: "Users retrieved successfully", data: paginatedUsers };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth() // Specify Bearer token is required
  @ApiOperation({ summary: 'Ban a user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User has been banned.', type: User })
  @Patch('ban/:id')
  @HttpCode(HttpStatus.OK)
  async banUser(@Param('id') id: number) {
    const isBan = await this.userService.banUser(id);
    return {statusCode: HttpStatus.OK, msg: "Operation successfully", data: isBan }
  }
}
