import fs from 'fs';
import path from 'path';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    // Extract the extensions of the file. In this case image/png
    const contentType = mime.getType(originalPath);

    if (!contentType) {
      throw new Error('File not found');
    }

    /**
     * Don't need encoding utf-8 because the file is not a file with text
     * content
     */
    const fileContent = await fs.promises.readFile(originalPath);

    /**
     * By default client.putObject doesn't return a promise. Use .promise() in
     * the end to allow await
     */
    await this.client
      .putObject({
        // Bucket name created on Amazon S3
        Bucket: uploadConfig.config.s3.bucket,
        // Name that the file will be named on Amazon S3
        Key: file,
        // What permissions we will give to this file
        ACL: 'public-read',
        Body: fileContent,
        /**
         * Allow Amazon S3 file URL to be opened in the browser instead of
         * downloading
         */
        ContentType: contentType,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        // Bucket name created on Amazon S3
        Bucket: uploadConfig.config.s3.bucket,
        // Name that the file will be named on Amazon S3
        Key: file,
      })
      .promise();
  }
}

export default DiskStorageProvider;
