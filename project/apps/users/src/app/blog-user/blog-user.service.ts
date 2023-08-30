import dayjs from 'dayjs';
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BlogUserMemoryRepository } from './blog-user-memory.repository';
import { CreateUserDto } from '../authentication/dto/create-user.dto';
import { USER_EXISTS, USER_NOT_FOUND, USER_PASSWORD_WRONG } from '../authentication/authentication.error';
import { BlogUserEntity } from './blog-user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginUserDto } from '../authentication/dto/login-user.dto';

@Injectable()
export class BlogUserService {
  constructor(
    private readonly blogUserRepository: BlogUserMemoryRepository,
  ) {}

  public async register(dto: CreateUserDto) {
    const { email, firstname, lastname, password, registrationDate } = dto;

    const blogUser = {
      email,
      firstname,
      lastname,
      avatar: '',
      registrationDate: dayjs(registrationDate).toDate(),
      passwordHash: ''
    };

    const existUser = await this.blogUserRepository.findByEmail(email);
    if (existUser) {
      throw new ConflictException(USER_EXISTS);
    }
    const userEntity = await new BlogUserEntity(blogUser).setPassword(password)
    return this.blogUserRepository.create(userEntity);
  }

  public async changePassword(dto: ChangePasswordDto) {
    const existUser = await this.verifyUser(dto);
    const updatedUser = await new BlogUserEntity(existUser).setPassword(dto.newPassword);
    const { id } = updatedUser;
    if (id) {
      return this.blogUserRepository.update(id, updatedUser);
    }
  }

  public async getUser(id: string) {
    return this.blogUserRepository.findOne(id);
  }

  public async verifyUser(dto: LoginUserDto) {
    const { email, password } = dto;
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (!existUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    const blogUserEntity = new BlogUserEntity(existUser);
    if (!await blogUserEntity.comparePassword(password)) {
      throw new UnauthorizedException(USER_PASSWORD_WRONG);
    }
    return blogUserEntity.toObject();
  }
}
