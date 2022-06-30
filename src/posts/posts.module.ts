import {
  BadRequestException,
  Module,
  UnauthorizedException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { multerConfig } from 'src/configs/multer.config';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [PrismaModule, MulterModule.register(multerConfig)],
})
export class PostsModule {}
