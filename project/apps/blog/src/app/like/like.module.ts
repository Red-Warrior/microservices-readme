import { Module } from '@nestjs/common';
import { LikeMemoryRepository } from './like-memory.repository';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';

@Module({
  controllers: [LikeController],
  providers: [LikeMemoryRepository, LikeService],
  exports: [LikeMemoryRepository]
})
export class LikeModule {}
