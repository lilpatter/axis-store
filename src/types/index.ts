export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  description: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  badge?: "New" | "Sale" | "Bestseller";
  inStock: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string; // e.g. "M / Black"
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  image: string;
}
