import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { BlogUserModule } from '../blog-user/blog-user.module';

@Module({
  imports: [BlogUserModule],
  controllers: [AuthenticationController]
})
export class AuthenticationModule {}
