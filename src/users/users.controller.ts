import { CreateUserDto } from './dto/create-user.dto';
import { Controller, Get, Post, Body, Param, Delete, Injectable } from '@nestjs/common';
import { CustomLogger } from '../common/logger/logger.service';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

// User
@Controller('users')
@Injectable()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: CustomLogger
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    this.logger.log('Fetching all users', 'UsersController', {
      endpoint: '/users',
      method: 'GET'
    });
    
    try {
      const users = await this.usersService.findAll();
      this.logger.debug(`Found ${users.length} users`, 'UsersController');
      return users;
    } catch (error) {
      this.logger.error('Failed to fetch users', error.stack, 'UsersController', {
        errorCode: 'USERS_FETCH_ERROR'
      });
      throw error;
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Creating new user', 'UsersController', {
      endpoint: '/users',
      method: 'POST',
      payload: createUserDto
    });

    try {
      const user = await this.usersService.create(createUserDto);
      this.logger.debug('User created successfully', 'UsersController', {
        userId: user.id
      });
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error.stack, 'UsersController', {
        errorCode: 'USER_CREATE_ERROR',
        payload: createUserDto
      });
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.warn(`Attempting to delete user ${id}`, 'UsersController', {
      endpoint: '/users/:id',
      method: 'DELETE',
      userId: id
    });

    try {
      await this.usersService.remove(id);
      this.logger.log(`User ${id} deleted successfully`, 'UsersController');
    } catch (error) {
      this.logger.error(`Failed to delete user ${id}`, error.stack, 'UsersController', {
        errorCode: 'USER_DELETE_ERROR',
        userId: id
      });
      throw error;
    }
  }
}
