import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';

const BUCKET_NAME = 'kimchiubereats0123';

@Controller('uploads')
export class UploadsController {
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    AWS.config.update({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
      },
    });
    try {
      const objectName = `${Date.now() + BUCKET_NAME}`;
      const newfile = await new AWS.S3()
        .putObject({
          Bucket: BUCKET_NAME,
          Body: file.buffer,
          Key: objectName,
          ACL: 'public-read',
        })
        .promise();
      console.log(newfile);
      const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
      return { url };
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
