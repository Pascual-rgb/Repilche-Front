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

  const addToCart = (product: Products, quantity: number) => {
    const existente = carrito.find((item) => item.id === product.id);

    if (existente) {
      setCarrito(
        carrito.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { ...product, quantity }]);
    }
  };

  const removeItem = (id: number) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const emptyCart = () => {
    setCarrito([]);
  };

  const getItemQuantity = () => {
    return carrito.reduce((acc, item) => acc + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return carrito.reduce(
      (acc, item) => acc + item.precio * item.quantity,
      0
    );
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        addToCart,
        removeItem,
        emptyCart,
        getItemQuantity,
        getTotalPrice,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};