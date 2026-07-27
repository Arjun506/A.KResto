import api from './api';
import { unwrap } from './helpers';

type CloudinarySignature = {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  signature: string;
  uploadUrl: string;
};

export const createCloudinarySignature = async (
  folder: string,
): Promise<CloudinarySignature> => {
  return unwrap<CloudinarySignature>(
    api.post('/uploads/cloudinary/signature', { folder }),
  );
};

export const uploadImageToCloudinary = async (
  file: File,
  folder: string,
): Promise<string> => {
  const signature = await createCloudinarySignature(folder);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signature.apiKey);
  formData.append('timestamp', String(signature.timestamp));
  formData.append('signature', signature.signature);
  formData.append('folder', signature.folder);

  const response = await fetch(signature.uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Image upload failed');
  }

  const data = (await response.json()) as { secure_url?: string };
  if (!data.secure_url) throw new Error('Cloudinary response missing URL');
  return data.secure_url;
};

export const attachImage = async (data: {
  target: 'restaurantLogo' | 'menuImage' | 'profileImage';
  targetId: string;
  imageUrl: string;
}) => {
  return unwrap(api.patch('/uploads/image', data));
};

