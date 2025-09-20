export interface Product {
  id: string | number;
  code: string; // Unique product code (e.g., 'SM-001' for smartphones, 'HP-001' for headphones, etc.)
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}