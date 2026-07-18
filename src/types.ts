export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  promoPrice?: number;
  warranty: string;
  stock: number;
  images: string[];
  rating: number;
  reviews: Review[];
  questions: Question[];
  specs: { [key: string]: string };
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isDailyDeal?: boolean;
  isPromo?: boolean;
  reviewsCount?: number;
  variations?: {
    name: string; // e.g., "Cor", "Capacidade"
    options: string[]; // e.g., ["Preto", "Prata"], ["128GB", "256GB"]
  }[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  adminReply?: string;
}

export interface Question {
  id: string;
  userName: string;
  text: string;
  date: string;
  answer?: string;
  answerDate?: string;
}

export interface Address {
  id: string;
  label: string; // e.g., "Casa", "Trabalho"
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'customer';
  addresses: Address[];
  wishlist: string[]; // Product IDs
  notifications: Notification[];
  createdAt: string;
  totalSpent?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedVariations?: { [key: string]: string };
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: Address;
  shippingMethod: 'express' | 'eco' | 'store';
  shippingPrice: number;
  shippingDays: number;
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'pix' | 'card' | 'boleto';
  paymentDetails: {
    cardBrand?: string;
    cardLast4?: string;
    pixCode?: string;
    boletoUrl?: string;
    transactionCode: string;
  };
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  trackingNumber?: string;
  createdAt: string;
  history: {
    status: string;
    date: string;
    note: string;
  }[];
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed' | 'free_shipping';
  value: number;
  minSubtotal?: number;
  minPurchase?: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  excerpt?: string;
  content: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime?: string;
  views: number;
  comments: BlogComment[];
}

export interface BlogComment {
  id: string;
  userName: string;
  comment: string;
  date: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  type: 'hero' | 'promo';
  isActive: boolean;
}

export interface SupportMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  reply?: string;
  status: 'unread' | 'read' | 'replied';
}

export interface SystemLog {
  id: string;
  action: string;
  user: string;
  date: string;
  details: string;
}
