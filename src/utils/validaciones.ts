export const regexAliasBancario = /^[a-zA-Z0-9]{1,}([.][a-zA-Z0-9]{1,})*$/;

export function validarAliasBancario(alias: string): { valido: boolean; error?: string } {
  const valor = alias.trim().toLowerCase();
  if (valor.length < 6 || valor.length > 20) {
    return { valido: false, error: "El alias debe tener entre 6 y 20 caracteres." };
  }
  if (/\s/.test(valor)) {
    return { valido: false, error: "El alias no puede contener espacios." };
  }
  if (!/^[a-zA-Z0-9.]+$/.test(valor) || valor.startsWith(".") || valor.endsWith(".") || valor.includes("..")) {
    return { valido: false, error: "Formato inválido. Solo letras, números y puntos (ej: repilche.moda.mp)." };
  }
  return { valido: true };
}

