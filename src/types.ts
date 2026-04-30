export type Category = 'Casual Wear' | 'Party Wear' | 'Ethnic Wear' | 'Daily Wear' | 'Men' | 'Women';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: Category;
  image: string;
  images: string[];
  description: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isLatest?: boolean;
  reviews?: Review[];
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  expiryDate: string;
  minOrderValue: number;
  active: boolean;
}

export type OrderStatus = 'Placed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  couponUsed?: string;
  discountAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'COD' | 'Razorpay' | 'UPI';
  shippingAddress: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
  }[];
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  wishlist: string[]; // array of product IDs
  createdAt: string;
}

export interface Analytics {
  dailyRevenue: { [key: string]: number };
  weeklyRevenue: { [key: string]: number };
  monthlyRevenue: { [key: string]: number };
  topProducts: { productId: string; name: string; sales: number }[];
  totalOrders: number;
}
