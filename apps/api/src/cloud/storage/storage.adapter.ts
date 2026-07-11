export interface StorageAdapter {
  /**
   * Saves a file buffer to storage and returns its relative URI or absolute URL.
   */
  save(key: string, buffer: Buffer, mimeType: string): Promise<string>;

  /**
   * Reads a file buffer from storage by key.
   */
  get(key: string): Promise<Buffer>;

  /**
   * Deletes a file from storage by key.
   */
  delete(key: string): Promise<void>;
}
