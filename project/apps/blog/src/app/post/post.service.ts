import { Injectable, NotFoundException } from '@nestjs/common';
import { PostMemoryRepository } from './post-memory.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entity/post.entity';
import { POST_NOT_FOUND } from './post.error';
import { IPost, PostStatus } from '@project/shared/app-types';
import { RepostDto } from './dto/repost.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostMemoryRepository
  ) {
  }

  public async create(dto: CreatePostDto) {
    const post = {
      ...dto,
      status: PostStatus.Published,
      creationDate: new Date().toISOString(),
      publicationDate: new Date().toISOString(),
    };
    const postEntity = new PostEntity(post);
    return this.postRepository.create(postEntity);
  }

  public async update(id: string, dto: UpdatePostDto) {
    const post = await this.findById(id);

    if (!post) {
      throw new NotFoundException(POST_NOT_FOUND);
    }
    const updatedPost = { ...post, ...dto };
    const postEntity = new PostEntity(updatedPost);
    return this.postRepository.update(id, postEntity);
  }

  public async repost(dto: RepostDto): Promise<IPost> {
    const { id, userId } = dto;
    const post = await this.findById(id);
    if (!post) {
      throw new NotFoundException(POST_NOT_FOUND);
    }
    const reposted = {
      ...post,
      userId: userId,
      originId: id,
      originUserId: post.userId,
      isReposted: true
    };
    delete reposted.id;
    return this.create(reposted);
  }

  public async remove(postId: string) {
    return this.postRepository.delete(postId);
  }

  public async findById(postId: string) {
    const post = await this.postRepository.findOne(postId);
    if (!post) {
      throw new NotFoundException(POST_NOT_FOUND);
    }
    return post;
  }

  public async findAll() {
    return this.postRepository.findMany();
  }
}
