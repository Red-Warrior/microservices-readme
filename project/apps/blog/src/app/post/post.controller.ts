import { Body, Controller, Post, Patch, Param, Delete, HttpStatus, Get } from '@nestjs/common';
import { PostService } from './post.service';
import { fillObject } from '@project/util/util-core';
import { ApiResponse } from '@nestjs/swagger';
import { PostRdo } from './rdo/post.rdo';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RepostDto } from './dto/repost.dto';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService
  ) {
  }

  @ApiResponse({
    type: PostRdo,
    status: HttpStatus.CREATED,
    description: 'The post has been created successfully!',
  })
  @Post('create')
  public async create(@Body() dto: CreatePostDto) {
    const post = await this.postService.create(dto);
    return fillObject(PostRdo, post)
  }

  @ApiResponse({
    type: PostRdo,
    status: HttpStatus.CREATED,
    description: 'The post has been reposted',
  })
  @Post('repost')
  public async repost(@Body() dto: RepostDto) {
    const post = await this.postService.repost(dto);
    return fillObject(PostRdo, post)
  }

  @ApiResponse({
    type: PostRdo,
    status: HttpStatus.CREATED,
    description: 'The post has been updated',
  })
  @Patch('update/:id')
  public async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    const post = await this.postService.update(id, dto);
    return fillObject(PostRdo, post);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The post has been deleted',
  })
  @Delete('delete/:id')
  public async delete(@Param('id') id: string) {
    return await this.postService.remove(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The post has been received',
  })
  @Get(':id')
  public async getPost(@Param('id') id: string) {
    const post = await this.postService.findById(id);
    return fillObject(PostRdo, post)
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The list of posts has been received',
  })
  @Get('/')
  public async getAllPosts() {
    const posts = await this.postService.findAll();
    if (posts) {
      return posts.map((post: PostRdo) => fillObject(PostRdo, post));
    }
  }
}
