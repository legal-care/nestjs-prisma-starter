import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CustomLogger } from '../common/logger/logger.service';
import { User, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private logger: CustomLogger
  ) {}

  async findAll() {
    this.logger.log('Fetching all users from database', 'UsersService');
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    this.logger.log(`Fetching user with id: ${id}`, 'UsersService');
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async create(createUserDto: CreateUserDto) {
    this.logger.log('Creating new user in database', 'UsersService', { data: createUserDto });
    return this.prisma.user.create({
      data: {
        ...createUserDto,
      }
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    this.logger.log(`Updating user ${id}`, 'UsersService', { data });
    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  async remove(id: string) {
    this.logger.log(`Removing user ${id}`, 'UsersService');
    return this.prisma.user.delete({
      where: { id }
    });
  }
}
