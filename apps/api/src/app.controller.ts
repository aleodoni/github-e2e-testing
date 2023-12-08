import { Controller, Get, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Controller()
export class AppController implements OnModuleInit, OnModuleDestroy {
  constructor(
  ) { }

  @Get()
  getHello(): string {
    return 'api is alive.';
  }

  async onModuleDestroy() {
  }

  async onModuleInit() {
  }
}
