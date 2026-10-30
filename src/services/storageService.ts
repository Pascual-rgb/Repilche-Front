import { supabase } from '../lib/supabaseClient';

/**
 * Sube una imagen de producto directamente al bucket público 'productos' de Supabase Storage.
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

  // Extraer extensión del archivo original asegurando fallback
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';

  // Generar identificador único robusto
  const uniqueId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 11);

  const fileName = `${Date.now()}-${uniqueId}.${extension}`;
  const filePath = `prendas/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('productos')
    .upload(filePath, file, {
      cacheControl: '3600',
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
 * Sube una imagen de avatar directamente al bucket público 'productos' de Supabase Storage en la carpeta 'avatars/'.
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

  // Extraer extensión del archivo original asegurando fallback
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';

  // Generar identificador único robusto
  const uniqueId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 11);

  const userPrefix = userId ? String(userId) : Date.now();
  const fileName = `${userPrefix}-${uniqueId}.${extension}`;
  const filePath = `avatars/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('productos')
    .upload(filePath, file, {
      cacheControl: '3600',
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

