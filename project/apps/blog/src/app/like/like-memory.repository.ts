import { LikeEntity } from './like.entity';
import { Injectable } from '@nestjs/common';
import { CRUDRepository } from '@project/util/util-types';
import { ILike } from '@project/shared/app-types';

@Injectable()
export class LikeMemoryRepository implements CRUDRepository<LikeEntity, string, ILike> {
  private repository: Record<string, string[]> = {};

  public async create(item: LikeEntity): Promise<ILike> {
    const entry = { ...item.toObject() };
    const { postId, userId, } = entry;
    if (!this.repository[postId]) {
      this.repository[entry.postId] = [];
      this.repository[entry.postId].push(userId);
    }
    this.repository[entry.postId].push(userId);
    return entry;
  }

  public async delete(item: LikeEntity): Promise<void> {
    const entry = { ...item.toObject() };
    const { postId, userId } = entry;
    this.repository[postId].filter((userIdFromRepository: string) => userIdFromRepository !== userId);
  }
}
