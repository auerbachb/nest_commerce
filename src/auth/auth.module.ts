import { Module } from '@nestjs/common';
import { ControllerModule } from './controller/controller.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [ControllerModule],
  controllers: [AuthController]
})
export class AuthModule {}
