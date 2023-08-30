import { CommentEntity } from './comment.entity';
import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RemoveCommentDto } from './dto/remove-comment.dto';
import { CRUDRepository } from '@project/util/util-types';
import { IComment } from '@project/shared/app-types';
import { COMMENT_NOT_FOUND } from './comment.error';

@Injectable()
export class CommentMemoryRepository implements CRUDRepository<CommentEntity, string | RemoveCommentDto, IComment> {
  private repository: Record<string, IComment[]> = {};

  public async create(item: CommentEntity): Promise<IComment> {
    const entry = {
      ...item.toObject(),
      id: randomUUID(),
      creationDate: new Date().toISOString()
    };

    if (!this.repository[entry.postId]) {
      this.repository[entry.postId] = [];
      this.repository[entry.postId].push(entry);
    }
    this.repository[entry.postId].push(entry);
    return this.findOne(entry.postId);
  }

  public async update(postId: string, item: CommentEntity): Promise<IComment> {
    const entry = { ...item.toObject() };
    if (this.repository[postId] && this.repository[postId].length) {
      this.repository[postId] = this.repository[postId].filter((comment: IComment) => comment.id !== entry.id);
      this.repository[postId].push(entry);
      return entry;
    }
    throw new NotFoundException(COMMENT_NOT_FOUND);
  }

  public async delete(dto: RemoveCommentDto): Promise<void> {
    const { id, postId } = dto;
    this.repository[postId].filter((comment: IComment) => comment.id !== id);
  }

  public async findOne(postId: string): Promise<IComment> {
    if (this.repository[postId]) {
      return { ...this.repository[postId][-1] };
    }
    throw new NotFoundException(COMMENT_NOT_FOUND);
  }
}
