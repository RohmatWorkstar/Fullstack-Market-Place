// Database types matching Supabase schema

export type UserRole = 'buyer' | 'seller';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  stock: number;
  created_at: string;
  updated_at: string;
  // joined
  seller?: Profile;
}

export interface Cart {
  id: string;
  user_id: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  // joined
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  payment_id: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  // joined
  product?: Product;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

// Categories
export const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Living',
  'Sports',
  'Books',
  'Health & Beauty',
  'Food & Beverages',
  'Others',
] as const;

export type Category = (typeof CATEGORIES)[number];
