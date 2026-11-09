import { useState, useEffect, createContext, useContext } from "react";
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
  // Inicialización perezosa (Lazy Initialization) desde localStorage
  const [carrito, setCarrito] = useState<CarritoItem[]>(() => {
    try {
      const storedCart = localStorage.getItem("repilche-cart");
      if (!storedCart) return [];
      const parsed = JSON.parse(storedCart);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sincronizar el carrito hacia localStorage ante cada cambio (agregar/eliminar/actualizar)
  useEffect(() => {
    try {
      if (carrito.length === 0) {
        localStorage.removeItem("repilche-cart");
      } else {
        localStorage.setItem("repilche-cart", JSON.stringify(carrito));
      }
    } catch (err) {
      console.warn("No se pudo sincronizar repilche-cart en localStorage:", err);
    }
  }, [carrito]);

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

  const emptyCart = (): void => {
    setCarrito([]);
    localStorage.removeItem("repilche-cart");
  };

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