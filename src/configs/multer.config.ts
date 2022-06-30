import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename(req, file, callback) {
      callback(null, `${randomUUID()}${extname(file.originalname)}`);
    },
  }),

  fileFilter(req, file, cb) {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      cb(new BadRequestException('Allowed formats: JPG | JPEG | PNG'), false);
    }
  },
  limits: { files: 1, fileSize: 5 * 1000000 },
};
