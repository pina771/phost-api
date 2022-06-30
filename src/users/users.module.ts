import { BadRequestException, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { multerConfig } from 'src/configs/multer.config';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, MulterModule.register(multerConfig)],
  exports: [UsersService],
})
export class UsersModule {}
