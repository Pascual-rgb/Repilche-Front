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

  const { error: uploadError } = await supabase.storage
    .from('productos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error al subir archivo a Supabase Storage:', uploadError);
    throw new Error(`Error al subir la imagen a Supabase Storage: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('productos')
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    throw new Error('No se pudo obtener la URL pública de la imagen subida.');
  }

  return publicUrlData.publicUrl;
}
