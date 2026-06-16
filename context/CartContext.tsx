'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  selectedVariant?: string;
}

export interface DeliveryDetails {
  fullName: string;
  phone: string;
  address: string;
  district: string;
}

export interface Order {
  id: string;
  timestamp: string;
  totalAmount: number;
  paymentStatus: 'Awaiting Verification' | 'Approved' | 'Refunded';
  fulfillmentStatus: 'Order Placed' | 'Processing' | 'Shipped' | 'Delivered';
  items: CartItem[];
  deliveryDetails: DeliveryDetails;
  trackingNumber?: string;
  courierName?: string;
}

export interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: any, quantity?: number, selectedVariant?: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;
  deliveryDetails: DeliveryDetails;
  setDeliveryDetails: React.Dispatch<React.SetStateAction<DeliveryDetails>>;
  orders: Order[];
  addOrder: (order: Order) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('fixorax_cart');
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error('Error fetching localStorage cart', e);
      }
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    fullName: 'Oshan Jayasri',
    phone: '+94 77 123 4567',
    address: 'No. 45, Flower Road, Colombo 07',
    district: 'Colombo'
  });

  const [orders, setOrders] = useState<Order[]>([]);

  // Load and seed orders from localStorage upon mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedOrders = localStorage.getItem('fixorax_orders');
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        } else {
          // Seed initial premium orders as requested by user
          const seedOrders: Order[] = [
            {
              id: 'FX-284905',
              timestamp: '2026-06-10 10:14 AM',
              totalAmount: 110000,
              paymentStatus: 'Approved',
              fulfillmentStatus: 'Delivered',
              items: [
                {
                  id: 'prod-wf1000xm5',
                  name: 'Sony WF-1000XM5 Hi-Res Buds',
                  price: 110000,
                  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
                  quantity: 1,
                  category: 'Audio & Wearables'
                }
              ],
              deliveryDetails: {
                fullName: 'Oshan Jayasri',
                phone: '+94 77 123 4567',
                address: 'No. 45, Flower Road, Colombo 07',
                district: 'Colombo'
              },
              courierName: 'Pronto Lanka',
              trackingNumber: 'PR-90342159'
            },
            {
              id: 'FX-728104',
              timestamp: '2026-06-14 04:35 PM',
              totalAmount: 517500,
              paymentStatus: 'Approved',
              fulfillmentStatus: 'Shipped',
              items: [
                {
                  id: 'prod-iphone15pro',
                  name: 'Fixora iPhone 15 Pro Max (Titanium)',
                  price: 485000,
                  image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
                  quantity: 1,
                  category: 'Smartphones',
                  selectedVariant: 'Storage Capacity: 256GB, Titanium Finish: Natural Titanium'
                },
                {
                  id: 'prod-magsafecharger',
                  name: 'Fixora Halo-Charge 3-in-1 Dock',
                  price: 32500,
                  image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=600&q=80',
                  quantity: 1,
                  category: 'Chargers & Cables',
                  selectedVariant: 'Mains Adapter: UK Standard (Sri Lanka)'
                }
              ],
              deliveryDetails: {
                fullName: 'Oshan Jayasri',
                phone: '+94 77 123 4567',
                address: 'No. 45, Flower Road, Colombo 07',
                district: 'Colombo'
              },
              courierName: 'Koombiyo Delivery',
              trackingNumber: 'KB-88203491'
            }
          ];
          localStorage.setItem('fixorax_orders', JSON.stringify(seedOrders));
          setOrders(seedOrders);
        }
      } catch (e) {
        console.error('Error fetching localStorage orders', e);
      }
    }
  }, []);

  // Sync cart with localStorage
  const syncCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('fixorax_cart', JSON.stringify(newCart));
    } catch (e) {
      console.error('Error syncing cart', e);
    }
  };

  const addToCart = (product: any, quantity: number = 1, selectedVariant?: string) => {
    const existingIndex = cart.findIndex(
      (item) => item.id === product.id && item.selectedVariant === selectedVariant
    );

    let newCart: CartItem[];

    if (existingIndex > -1) {
      newCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      newCart = [
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          category: product.category,
          selectedVariant
        }
      ];
    }
    syncCart(newCart);
  };

  const updateQuantity = (id: string, delta: number) => {
    const newCart = cart
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    syncCart(newCart);
  };

  const removeFromCart = (id: string) => {
    const newCart = cart.filter((item) => item.id !== id);
    syncCart(newCart);
  };

  const clearCart = () => {
    syncCart([]);
  };

  const addOrder = (order: Order) => {
    const updatedOrders = [order, ...orders];
    setOrders(updatedOrders);
    try {
      localStorage.setItem('fixorax_orders', JSON.stringify(updatedOrders));
    } catch (e) {
      console.error('Error saving orders', e);
    }
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartItemCount,
        deliveryDetails,
        setDeliveryDetails,
        orders,
        addOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider');
  }
  return context;
}
