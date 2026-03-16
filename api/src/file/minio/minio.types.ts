export interface PresignedURLGenerator {
  presignedPutObject(bucketName: string, objectName: string, expires: number): Promise<string>;
  presignedGetObject(bucketName: string, objectName: string, expires: number): Promise<string>;
}

export interface BlobStorage {
  bucketExists(bucketName: string): Promise<boolean>;
  makeBucket(bucketName: string, region?: string): Promise<void>;
  statObject(bucketName: string, objectName: string): Promise<any>;
  removeObject(bucketName: string, objectName: string): Promise<void>;
}