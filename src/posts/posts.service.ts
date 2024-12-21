import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Post as PostModel } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<PostModel[]> {
    return await this.prisma.post.findMany();
  }

  async findOne(id: string): Promise<PostModel | null> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async create(data: Prisma.PostCreateInput): Promise<PostModel> {
    return this.prisma.post.create({ data });
  }

  async update(id: string, data: Prisma.PostUpdateInput): Promise<PostModel> {
    return this.prisma.post.update({ where: { id }, data });
  }

  async delete(id: string): Promise<PostModel> {
    return this.prisma.post.delete({ where: { id } });
  }
}