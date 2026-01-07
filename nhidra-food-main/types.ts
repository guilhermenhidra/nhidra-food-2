
export enum View {
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  ORDERS = 'orders',
  MENU = 'menu',
  TEAM = 'team',
  SETTINGS = 'settings',
  WAITER = 'waiter',
  KITCHEN = 'kitchen',
  CASHIER = 'cashier',
  PLANS = 'plans',
  TERMS = 'terms',
  PRIVACY = 'privacy',
  DIGITAL_MENU = 'cardapio-digital'
}

export interface Order {
  id: string;
  table: string;
  client: string;
  status: 'Em preparo' | 'Entregue' | 'Pronto';
  total: string;
  date: string;
  items?: { name: string; quantity: number; kitchenArea: string; isPrinted?: boolean }[];
  invoiceIssued?: boolean;
  waiter?: string;
  cashier?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  variations: string;
  imageUrl: string;
  hasTwoFlavors?: boolean;
  kitchenArea: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'Ativo' | 'Pendente';
  color?: string; // Cor específica para garçons
}
