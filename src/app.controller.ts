import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Default')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('test/errors')
  testErrors(): string {
    throw new UnauthorizedException({ message: 'unknown error' });
  }
}
