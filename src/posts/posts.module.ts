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

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    PrismaModule,
    MulterModule.register({
      storage: diskStorage({
        destination: 'uploads',
        filename(req, file, callback) {
          callback(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),

      fileFilter(req, file, cb) {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          // Allow storage of file
          cb(null, true);
        } else {
          cb(
            new BadRequestException('Allowed formats: JPG | JPEG | PNG'),
            false,
          );
        }
      },
      limits: { files: 1, fileSize: 5 * 1000000 },
    }),
  ],
})
export class PostsModule {}
