import { supabase } from '../lib/supabaseClient';
import imageCompression from 'browser-image-compression';

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.25, // Máximo ~250 KB para optimizar ancho de banda (Cached egress)
  maxWidthOrHeight: 1080,
  useWebWorker: true,
  fileType: 'image/webp',
};

/**
 * Comprime una imagen en el navegador antes de subirla a Supabase.
 */
async function compressImageFile(file: File): Promise<File> {
  try {
    const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
    return compressed;
  } catch (error) {
    console.warn('No se pudo comprimir la imagen en el cliente, subiendo archivo original:', error);
    return file;
  }
}

/**
 * Sube una imagen de producto directamente al bucket público 'productos' de Supabase Storage.
 * Comprime la imagen en WebP (~250 KB max, 1080px max) antes del upload.
 * Genera un nombre único con timestamp y UUID en la ruta 'prendas/<nombre_archivo>'.
 * Retorna la URL pública accesible de la imagen.
 *
 * @param file Archivo nativo File a subir
 * @returns Promesa que resuelve a la URL pública de la imagen
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (!file) {
    throw new Error('No se proporcionó ningún archivo para subir.');
  }

  // 1. Comprimir imagen en el cliente
  const fileToUpload = await compressImageFile(file);

  // Extraer extensión del archivo comprimido asegurando fallback
  const extension =
    fileToUpload.type === 'image/webp'
      ? 'webp'
      : fileToUpload.type === 'image/jpeg' || fileToUpload.type === 'image/jpg'
      ? 'jpg'
      : file.name.split('.').pop()?.toLowerCase() || 'webp';

  // Generar identificador único robusto
  const uniqueId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 11);

  const fileName = `${Date.now()}-${uniqueId}.${extension}`;
  const filePath = `prendas/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('productos')
    .upload(filePath, fileToUpload, {
      cacheControl: '3600',
      contentType: fileToUpload.type || (extension === 'webp' ? 'image/webp' : 'image/jpeg'),
      upsert: false,
    });

  if (uploadError) {
    console.error('Error al subir archivo a Supabase Storage:', uploadError);
    throw new Error(`Error al subir la imagen a Supabase Storage: ${uploadError.message}`);
  }

  // Usar uploadData.path asegurando que se solicita la URL para el path exacto subido
  const targetPath = uploadData?.path || filePath;

  const { data: publicUrlData } = supabase.storage
    .from('productos')
    .getPublicUrl(targetPath);

  const publicUrl = publicUrlData?.publicUrl;

  if (!publicUrl) {
    throw new Error('No se pudo obtener la URL pública de la imagen subida.');
  }

  return publicUrl;
}

/**
 * Sube una imagen de avatar directamente al bucket público 'productos' de Supabase Storage en la ruta 'prendas/avatar-...'.
 * Comprime la imagen en WebP (~250 KB max, 1080px max) antes del upload.
 * Utiliza la carpeta 'prendas/' para respetar las políticas de Row-Level Security (RLS) habilitadas en el bucket.
 * Retorna la URL pública accesible del avatar.
 *
 * @param file Archivo nativo File a subir
 * @param userId ID opcional del usuario para nombrar el archivo
 * @returns Promesa que resuelve a la URL pública de la imagen
 */
export async function uploadAvatarImage(file: File, userId?: number | string): Promise<string> {
  if (!file) {
    throw new Error('No se proporcionó ningún archivo para subir.');
  }

  // 1. Comprimir avatar en el cliente
  const fileToUpload = await compressImageFile(file);

  const extension =
    fileToUpload.type === 'image/webp'
      ? 'webp'
      : fileToUpload.type === 'image/jpeg' || fileToUpload.type === 'image/jpg'
      ? 'jpg'
      : file.name.split('.').pop()?.toLowerCase() || 'webp';

  // Generar identificador único robusto
  const uniqueId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 9);

  const userPrefix = userId ? String(userId) : Date.now();
  const filePath = `prendas/avatar-${userPrefix}-${uniqueId}.${extension}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('productos')
    .upload(filePath, fileToUpload, {
      cacheControl: '3600',
      contentType: fileToUpload.type || (extension === 'webp' ? 'image/webp' : 'image/jpeg'),
      upsert: true,
    });

  if (uploadError) {
    console.error('Error al subir avatar a Supabase Storage:', uploadError);
    throw new Error(`Error al subir la imagen de avatar a Supabase Storage: ${uploadError.message}`);
  }

  const targetPath = uploadData?.path || filePath;

  const { data: publicUrlData } = supabase.storage
    .from('productos')
    .getPublicUrl(targetPath);

  const publicUrl = publicUrlData?.publicUrl;

  if (!publicUrl) {
    throw new Error('No se pudo obtener la URL pública del avatar subido.');
  }

  return publicUrl;
}

