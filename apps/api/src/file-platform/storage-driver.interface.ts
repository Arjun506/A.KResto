export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer?: Buffer;
  destination?: string;
  filename?: string;
  path?: string;
}

export interface UploadedFileDescriptor {
  key: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  path?: string;
}

export interface IStorageDriver {
  upload(file: MulterFile, folder?: string): Promise<UploadedFileDescriptor>;
  getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
  delete(key: string): Promise<boolean>;
}
