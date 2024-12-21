import { Controller, Delete, Get, Put, Post, Body, Param, Injectable } from '@nestjs/common';
import { Post as PostModel } from '@prisma/client';
import { PostsService } from './posts.service';
import { CustomLogger } from '../common/logger/logger.service';

@Controller('posts')
@Injectable()
export class PostsController {
  constructor(private readonly postsService: PostsService, private readonly logger: CustomLogger) {}

  @Get()
  async findAll(): Promise<PostModel[]> {
    this.logger.log('Fetching all posts', 'PostsController', {
      endpoint: '/posts',
      method: 'GET'
    });
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostModel> {
    this.logger.log(`Fetching post with id ${id}`, 'PostsController', {
      endpoint: `/posts/${id}`,
      method: 'GET'
    });
    return this.postsService.findOne(id);
  }

  @Post()
  async create(@Body() post: PostModel): Promise<PostModel> {
    this.logger.log('Creating a new post', 'PostsController', {
      endpoint: '/posts',
      method: 'POST',
      body: post
    });
    return this.postsService.create(post);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() post: PostModel): Promise<PostModel> {
    this.logger.log(`Updating post with id ${id}`, 'PostsController', {
      endpoint: `/posts/${id}`,
      method: 'PUT',
      body: post
    });
    return this.postsService.update(id, post);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<PostModel> {
    this.logger.log(`Deleting post with id ${id}`, 'PostsController', {
      endpoint: `/posts/${id}`,
      method: 'DELETE'
    });
    return this.postsService.delete(id);
  }
}
