import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import type { ImageProps } from "./types";
import { Buffer } from 'buffer';

const cache = new Map<string, string>();
const REQUEST_TIMEOUT = 15000;
const MAX_RETRIES = 3;

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return response;

  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export default async function getBase64ImageUrl(
  image: ImageProps
): Promise<string> {
  const cacheKey = `${image.public_id}_${image.format}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) throw new Error("Cloudinary cloud name not configured");

    const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_jpg,w_8,q_86/${image.public_id}.${image.format}`;
    
    const response = await fetchWithRetry(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    
    // Решение проблемы типов
    const minified = await imagemin.buffer(
      Buffer.from(arrayBuffer) as unknown as Uint8Array, 
      { plugins: [imageminJpegtran()] }
    );

    const base64 = `data:image/jpeg;base64,${Buffer.from(minified).toString("base64")}`;
    cache.set(cacheKey, base64);
    
    return base64;

  } catch (error) {
    console.error(`[Image Processing] Failed to process ${image.public_id}:`, error);
    throw error;
  }
}