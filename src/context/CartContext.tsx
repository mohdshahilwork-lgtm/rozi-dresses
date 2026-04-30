import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Coupon } from '../types';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  activeCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  discountAmount: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Mock Coupons for now (will come from Firestore later)
const MOCK_COUPONS: Coupon[] = [
  { code: 'ROZI10', type: 'percentage', value: 10, minOrderValue: 500, expiryDate: '2026-12-31', active: true },
  { code: 'FLAT200', type: 'fixed', value: 200, minOrderValue: 1500, expiryDate: '2026-12-31', active: true },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Open cart when item added
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    // Check stock limit
    const safeQuantity = Math.min(quantity, item.stock);
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: safeQuantity } : item));
  };

  const applyCoupon = async (code: string) => {
    // In a real app, this would be an API call to the backend
    const coupon = MOCK_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
    
    if (!coupon) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    if (subtotal < coupon.minOrderValue) {
      return { success: false, message: `Minimum order of ₹${coupon.minOrderValue} required for this coupon.` };
    }

    setActiveCoupon(coupon);
    return { success: false, message: `Coupon ${code} applied successfully!` };
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const discountAmount = activeCoupon 
    ? (activeCoupon.type === 'percentage' ? (cartTotal * activeCoupon.value) / 100 : activeCoupon.value)
    : 0;

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return (
    <CartContext.Provider value={{ 
      cart, 
      isCartOpen, 
      setIsCartOpen, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartTotal, 
      itemCount,
      activeCoupon,
      applyCoupon,
      discountAmount,
      finalTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

