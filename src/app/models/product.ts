export interface ProductComment {
  userId: string;
  userName: string;
  comment: string;
  timestamp: Date;
}

export interface Product {
  id: number;
  product_name: string;
  product_title: string;
  product_description: string;
  brandId: number;
  genreId: number;
  product_image: string;
  price: number;
  in_bundle: boolean;
  quantity: number;
  in_cart: boolean;
  discountPercentage?: number;
  salePrice?: number;
  onSale: boolean;
  date_created?: Date;
  uploaderId: string;
  comments?: ProductComment[];
}
