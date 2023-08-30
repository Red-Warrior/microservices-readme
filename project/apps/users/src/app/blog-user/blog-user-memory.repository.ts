import { randomUUID } from 'node:crypto';
import { BlogUserEntity } from './blog-user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { USER_NOT_FOUND } from '../authentication/authentication.error';
import { CRUDRepository } from '@project/util/util-types';
import { IUser } from '@project/shared/app-types';

@Injectable()
export class BlogUserMemoryRepository implements CRUDRepository<BlogUserEntity, string, IUser> {
  private repository: Record<string, IUser> = {};

  public async create(item: BlogUserEntity): Promise<IUser> {
    const entry = { ...item.toObject(), id: randomUUID() };
    this.repository[entry.id] = entry;
    return entry;
  }

  public async update(id: string, item: BlogUserEntity): Promise<IUser> {
    this.repository[id] = { ...item.toObject(), id };
    return this.findOne(id);
  }

  public async findOne(id: string): Promise<IUser> {
    if (this.repository[id]) {
      return { ...this.repository[id] };
    }
    throw new NotFoundException(USER_NOT_FOUND);
  }

  public async findByEmail(email: string): Promise<IUser> {
    const existUser = Object.values(this.repository)
      .find((userItem) => userItem.email === email);

    if (!existUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return { ...existUser };
  }

  public async delete(id: string): Promise<void> {
    delete this.repository[id];
  }
}
