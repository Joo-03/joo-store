import { createContext, useContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Product, CartItem } from '@/types/product';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productCode: string) => void;
  updateQuantity: (productCode: string, quantity: number) => void;
  getTotalItems: () => number;
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
}

const CART_STORAGE_KEY = 'joo-store-cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

const parseCartItems = (savedCart: string | null): CartItem[] => {
  if (!savedCart) return [];
  try {
    const parsed = JSON.parse(savedCart);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error parsing cart items:', error);
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    const items = parseCartItems(savedCart);
    setCartItems(items);
    setIsInitialized(true);
    console.log('Cart initialized with items:', items);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;
    
    console.log('Saving cart to localStorage:', cartItems);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems, isInitialized]);

  const addToCart = useCallback((product: Product) => {
    if (!product?.code) {
      console.error('Invalid product or missing code:', product);
      return;
    }

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.code === product.code);
      
      if (existingItemIndex >= 0) {
        // Item exists, increase quantity by 1
        console.log('Increasing quantity for existing item');
        return prevItems.map((item, index) => 
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item with quantity 1
        console.log('Adding new item to cart');
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productCode: string) => {
    setCartItems(prev => prev.filter(item => item.code !== productCode));
  }, []);

  const updateQuantity = useCallback((productCode: string, newQuantity: number) => {
    console.log(`updateQuantity called for ${productCode} with quantity ${newQuantity}`);
    
    setCartItems(prevItems => {
      // If quantity is 0 or less, remove the item
      if (newQuantity <= 0) {
        console.log(`Removing item ${productCode} (quantity <= 0)`);
        return prevItems.filter(item => item.code !== productCode);
      }
      
      // Find the item to update
      const itemIndex = prevItems.findIndex(item => item.code === productCode);
      if (itemIndex === -1) {
        console.log(`Item ${productCode} not found in cart`);
        return prevItems;
      }
      
      // Create a new array with the updated item
      const updatedItems = [...prevItems];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity: newQuantity
      };
      
      console.log('Updated cart items:', updatedItems);
      return updatedItems;
    });
  }, [removeFromCart]);

  // Returns the number of unique items in the cart
  const getTotalItems = useCallback(() => {
    return cartItems.length;
  }, [cartItems]);

  // Returns the total quantity of all items in the cart (sum of quantities)
  const getTotalQuantity = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      return total + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0);
  }, [cartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalQuantity,
    getTotalPrice,
    clearCart,
  }), [
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalQuantity,
    getTotalPrice,
    clearCart,
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
