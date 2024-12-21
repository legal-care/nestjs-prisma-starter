import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CustomLogger } from '../common/services/logger.service';
import { User, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private logger: CustomLogger
  ) {}

  async findAll() {
    this.logger.debug('Fetching all users from database', 'UsersService');
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    this.logger.debug(`Fetching user with id: ${id}`, 'UsersService');
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async create(createUserDto: CreateUserDto) {
    this.logger.debug('Creating new user in database', 'UsersService', { data: createUserDto });
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        role: 'USER'
      }
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    this.logger.debug(`Updating user ${id}`, 'UsersService', { data });
    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  async remove(id: string) {
    this.logger.debug(`Removing user ${id}`, 'UsersService');
    return this.prisma.user.delete({
      where: { id }
    });
  }
}
