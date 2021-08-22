import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('abc')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getUser(): string {
    return this.appService.getUser();
  }
  @Post('hi')
  postUser(): string {
    return this.appService.postUser();
  }
}
