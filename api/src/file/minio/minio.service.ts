import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { PresignedURLGenerator } from './minio.types';
import { Readable } from 'stream';

@Injectable()
export class MinioService implements PresignedURLGenerator {
  private readonly client: Minio.Client;
  private readonly presignedClient: Minio.Client;
  private readonly logger = new Logger(MinioService.name);
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('MINIO_ENDPOINT', 'minio:9000');
    const publicEndpoint = this.configService.get<string>('MINIO_PUBLIC_ENDPOINT', endpoint);
    const accessKey = this.configService.getOrThrow<string>('MINIO_ACCESS_KEY');
    const secretKey = this.configService.getOrThrow<string>('MINIO_SECRET_KEY');
    const useSSL = this.configService.get<boolean>('MINIO_USE_SSL', false);
    const region = this.configService.get<string>('MINIO_REGION', 'ru-central-1');
    this.bucket = this.configService.get<string>('MINIO_BUCKET', 'cloud-storage');

    const [host, port] = endpoint.split(':');

    this.client = new Minio.Client({
      endPoint: host,
      port: parseInt(port || '9000', 10),
      useSSL,
      accessKey,
      secretKey,
      region,
    });

    const [pubHost, pubPort] = publicEndpoint.split(':');
    this.presignedClient = new Minio.Client({
      endPoint: pubHost,
      port: parseInt(pubPort || '9000', 10),
      useSSL,
      accessKey,
      secretKey,
      region,
    });

    this.ensureBucketExists();
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        await this.client.makeBucket(this.bucket, this.configService.get<string>('MINIO_REGION', 'ru-central-1'));
        this.logger.log(`Bucket ${this.bucket} created`);
      }
    } catch (error) {
      this.logger.error(`Failed to ensure bucket exists: ${error.message}`);
      throw error;
    }
  }

  async bucketExists(bucketName: string): Promise<boolean> {
    return this.client.bucketExists(bucketName);
  }

  async makeBucket(bucketName: string, region?: string): Promise<void> {
    await this.client.makeBucket(bucketName, region);
  }

  async statObject(bucketName: string, objectName: string): Promise<Minio.BucketItemStat> {
    return this.client.statObject(bucketName, objectName);
  }

  async removeObject(bucketName: string, objectName: string): Promise<void> {
    await this.client.removeObject(bucketName, objectName);
  }

  async presignedPutObject(bucketName: string, objectName: string, expires: number): Promise<string> {
    return this.presignedClient.presignedPutObject(bucketName, objectName, expires);
  }

  async presignedGetObject(bucketName: string, objectName: string, expires: number): Promise<string> {
    return this.presignedClient.presignedGetObject(bucketName, objectName, expires);
  }

  async uploadFile(
    bucketName: string,
    objectName: string,
    stream: Buffer | Readable,
    size?: number,
    metaData?: Minio.ItemBucketMetadata,
  ): Promise<void> {
    await this.client.putObject(bucketName, objectName, stream, size, metaData);
  }

  async downloadFile(bucketName: string, objectName: string): Promise<NodeJS.ReadableStream> {
    return this.client.getObject(bucketName, objectName);
  }
}