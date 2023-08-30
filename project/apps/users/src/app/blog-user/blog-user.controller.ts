import { Body, Controller, Get, HttpStatus, Param, Post, Patch } from '@nestjs/common';
import { BlogUserService } from './blog-user.service';
import { ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../authentication/dto/create-user.dto';
import { fillObject } from '@project/util/util-core';
import { UserRdo } from '../authentication/rdo/user.rdo';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('blog-users')
export class BlogUserController {
  constructor(
    private readonly blogUser: BlogUserService
  ) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The new user has been successfully created.'
  })
  @Post('register')
  public async create(@Body() dto: CreateUserDto) {
    const newUser = await this.blogUser.register(dto);
    return fillObject(UserRdo, newUser);
  }

  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: 'User found'
  })
  @Get(':id')
  public async getUser(@Param('id') id: string) {
    const existUser = await this.blogUser.getUser(id);
    return fillObject(UserRdo, existUser);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The password successfully changed.'
  })
  @Patch('change-password')
  public async changePassword(@Body() dto: ChangePasswordDto) {
    const userWithUpdatedPassword = await this.blogUser.changePassword(dto);
    return fillObject(UserRdo, userWithUpdatedPassword);
  }
}
