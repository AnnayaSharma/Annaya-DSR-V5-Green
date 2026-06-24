export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  description: string;
  category: string;
  images: string[];
  rating: number;
  reviewCount: number;
  /** At least one size is always expected; guard before accessing [0] */
  sizes: string[];
  colors?: { name: string; hex: string }[];
  stock?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  createdAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor?: string;
}
