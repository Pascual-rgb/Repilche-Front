/**
 * Intercala productos por vendedor (Round-Robin) para que en el catálogo
 * no aparezcan consecutivamente prendas del mismo vendedor.
 */
export function intercalarPorVendedor<
  T extends {
    id: number | string;
    vendedor?: any;
    vendedor_id?: number | string;
    [key: string]: any;
  }
>(items: T[]): T[] {
  if (!items || items.length === 0) return [];

  // Agrupar productos por vendedor (usando ID, objeto vendedor, string de vendedor o vendedor_id)
  const grupos: Record<string, T[]> = {};
  items.forEach((item) => {
    const rawVendedor = item.vendedor;
    const key = String(
      item.vendedor_id ||
      (typeof rawVendedor === 'object' && rawVendedor !== null
        ? rawVendedor.id || rawVendedor.nombre || rawVendedor.email
        : rawVendedor) ||
      (item as any).vendedor_nombre ||
      'sin_vendedor'
    );

    if (!grupos[key]) {
      grupos[key] = [];
    }
    grupos[key].push(item);
  });

  // Intercalar uno de cada vendedor en cada ronda
  const resultado: T[] = [];
  let quedanElementos = true;

  while (quedanElementos) {
    quedanElementos = false;
    for (const key of Object.keys(grupos)) {
      if (grupos[key].length > 0) {
        resultado.push(grupos[key].shift()!);
        quedanElementos = true;
      }
    }
  }

  return resultado;
}

