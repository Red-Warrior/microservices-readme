import { Injectable } from '@nestjs/common';
import { CommentMemoryRepository } from './comment-memory.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { RemoveCommentDto } from './dto/remove-comment.dto';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentMemoryRepository
  ) {}

  public async create(dto: CreateCommentDto) {
    const comment = {
      ...dto, creationDate: new Date().toISOString()
    };
    const userEntity = new CommentEntity(comment)
    return this.commentRepository.create(userEntity);
  }

  public async update(dto: CreateCommentDto) {
    const comment = {
      ...dto, creationDate: new Date().toISOString()
    };
    const userEntity = new CommentEntity(comment)
    return this.commentRepository.update(comment.id, userEntity);
  }

  public async delete(dto: RemoveCommentDto) {
    return this.commentRepository.delete(dto);
  }

  public async findOne(postId: string) {
    return this.commentRepository.findOne(postId);
  }
}
