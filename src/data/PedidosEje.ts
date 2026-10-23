import { productos } from "./products";
import type { Products } from "./products";

export interface Pedido {
  id: number;
  producto: Products;
  comprador: string;
  vendedor: string;
  telefonoVendedor: string;
  codigo: string;
  estado: "pendiente" | "entregado";
}

export const MI_NOMBRE = "Ivan Pascualich";

export const pedidosMock: Pedido[] = [
  {
    id: 1,
    producto: productos[0],
    comprador: "Martina Saavedra",
    vendedor: "Ivan Pascualich",
    telefonoVendedor: "280 4123456",
    codigo: "483920",
    estado: "pendiente",
  },
  {
    id: 2,
    producto: productos[1],
    comprador: "Natacha Gader",
    vendedor: "Ivan Pascualich",
    telefonoVendedor: "280 4123456",
    codigo: "105738",
    estado: "pendiente",
  },
];