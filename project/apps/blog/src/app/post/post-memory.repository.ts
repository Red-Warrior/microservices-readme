import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { PostEntity } from './entity/post.entity';
import { CRUDRepository } from '@project/util/util-types';
import { IPost } from '@project/shared/app-types';

@Injectable()
export class PostMemoryRepository implements CRUDRepository<PostEntity, string, IPost> {
  private repository: Record<string, IPost> = {};

  public async create(item: PostEntity): Promise<IPost> {
    const entry = { ...item.toObject(), id: randomUUID() };
    this.repository[entry.id] = entry;
    return entry;
  }

  public async update(id: string, item: PostEntity): Promise<IPost> {
    const entry = { ...item.toObject() };
    this.repository[entry.id as string] = { ...item.toObject() };
    return { ...this.repository[entry.id as string] }
  }

  public async delete(id: string): Promise<void> {
    delete this.repository[id];
  }

  public async findOne(id: string): Promise<IPost | null> {
    if (this.repository[id]) {
      return { ...this.repository[id] };
    }
    return null;
  }

  public async findMany(): Promise<IPost[] | null> {
    const existPost = Object.values(this.repository)

    if (!existPost) {
      return null;
    }
    return [...existPost];
  }
}
