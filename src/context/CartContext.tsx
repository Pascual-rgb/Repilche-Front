import { useState, createContext, useContext } from "react";
import type { Products } from "../data/products";

interface CarritoItem extends Products {
  quantity: number;
}

interface CarritoContextType {
  carrito: CarritoItem[];
  addToCart: (product: Products, quantity: number) => void;
  removeItem: (id: number) => void;
  emptyCart: () => void;
  getItemQuantity: () => number;
  getTotalPrice: () => number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const useCarritoContext = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error("useCarritoContext debe usarse dentro de CarritoProvider");
  }
  return context;
};

export const CarritoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const isInCart = (id: number): boolean => carrito.some(p => p.id === id);

  const addToCart = (product: Products, quantity: number): void => {
    const itemExistente = carrito.find(p => p.id === product.id);
    const cantidadTotal = itemExistente ? itemExistente.quantity + quantity : quantity;

    if (cantidadTotal > product.stock) {
      return console.warn('No hay stock suficiente. Máximo disponible: ' + product.stock);
    }

    if (isInCart(product.id)) {
      setCarrito(carrito.map(p => 
        p.id === product.id 
          ? { ...p, quantity: p.quantity + quantity } 
          : p
      ));
    } else {
      setCarrito(aux => [...aux, { ...product, quantity }]);
    }
  };

  const removeItem = (id: number): void => setCarrito(aux => aux.filter(p => p.id !== id));

  const emptyCart = (): void => setCarrito([]);

  const getItemQuantity = (): number => carrito.reduce((acum, p) => acum + p.quantity, 0);

  const getTotalPrice = (): number => carrito.reduce((acum, p) => acum + p.precio * p.quantity, 0);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        addToCart,
        removeItem,
        emptyCart,
        getItemQuantity,
        getTotalPrice,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};