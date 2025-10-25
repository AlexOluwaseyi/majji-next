export type Page =
  | "home"
  | "browse"
  | "product"
  | "dashboard"
  | "auth"
  | "add-product";

export interface NavigationOptions {
  page: Page;
  productId?: string;
  searchTerm?: string;
}

export interface User {
  id: string;
  name?: string | null;
  email: string;
  type: "buyer" | "seller";
  image?: string | null;
  company?: string | null; // for buyers
  verified?: boolean;
  rating?: number | null; // for sellers
  totalSales?: number | null; // for sellers
  isAdmin: boolean;
  createdAt?: Date | string;
}

export interface ProductPageProps {
  productId: string | null;
  onNavigate: (options: NavigationOptions | string) => void;
}
