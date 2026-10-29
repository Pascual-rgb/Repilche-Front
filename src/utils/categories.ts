/**
 * Normaliza y verifica si una prenda coincide con una categoría determinada.
 * 
 * Admite coincidencia tanto por ID numérico como por nombre (case-insensitive),
 * contemplando variaciones comunes como singular/plural o presencia de tildes.
 */
export const coincideCategoria = (
  p: any,
  filtro: string | number | undefined | null
): boolean => {
  if (filtro === undefined || filtro === null || filtro === "") return true;

  const filtroStr = String(filtro).toLowerCase().trim();
  const filtroNum = Number(filtro);
  const esNumero = !isNaN(filtroNum) && filtroNum > 0;

  // 1. Coincidencia por ID numérico (ej. p.categoria === 2 o p.categoria_id === 2)
  if (esNumero) {
    if (p.categoria === filtroNum || p.categoria_id === filtroNum) return true;
    if (typeof p.categoria === "object" && p.categoria?.id === filtroNum) return true;
    if (p.categoria_detail?.id === filtroNum) return true;
  }

  // 2. Función auxiliar para remover acentos y espacios
  const normalizar = (str: unknown) =>
    typeof str === "string"
      ? str
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim()
      : "";

  const filtroNorm = normalizar(filtroStr);
  // Raíz de la palabra para equiparar singulares y plurales (ej. remeras -> remera, pantalones -> pantalon, abrigos -> abrigo)
  const filtroRaiz = filtroNorm.replace(/es$|s$/, "");

  // 3. Comparación case-insensitive de nombres de categoría en el producto
  const nombresCandidatos: unknown[] = [
    p.categoria_nombre,
    p.categoria?.nombre,
    typeof p.categoria === "string" ? p.categoria : null,
    p.categoria_detail?.nombre,
  ];

  if (Array.isArray(p.cat)) {
    nombresCandidatos.push(...p.cat);
  }

  return nombresCandidatos.some((cand) => {
    if (!cand) return false;
    const candNorm = normalizar(cand);
    const candRaiz = candNorm.replace(/es$|s$/, "");

    return (
      candNorm === filtroNorm ||
      (filtroRaiz.length >= 3 && (candNorm.includes(filtroRaiz) || filtroNorm.includes(candRaiz)))
    );
  });
};
