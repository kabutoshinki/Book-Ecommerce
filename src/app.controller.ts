import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Render,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { RedisConfigService } from 'config/redis.config';
import { RedisService } from 'nestjs-redis';
import { CacheKey } from '@nestjs/cache-manager';

@Controller()
@ApiTags('Default')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('pages/index')
  root() {
    return { title: 'Index Page', layout: 'layouts/layout', name: 'Guest' };
  }

  @Get('about')
  @Render('pages/about')
  about() {
    return { title: 'About Page', name: 'huy' };
  }
  @Get('login')
  @Render('pages/login')
  login() {
    return { title: 'Login Page', name: 'huy' };
  }
  @Post()
  async setCacheKey(@Query('key') key: string, @Query('value') value: string) {
    await this.appService.setCacheKey(key, value);
    return {
      success: 200,
      status: 201,
      message: 'Key cached successfully',
    };
  }
  @Get('get/:key')
  async getCacheKey(@Param('key') key: string) {
    const data = await this.appService.getCacheKey(key);
    console.log(data);

    return {
      success: 200,
      status: 201,
      data,
    };
  }
  @Get('test/errors')
  testErrors(): string {
    throw new UnauthorizedException({ message: 'unknown error' });
  }
}
