export interface Sale {
  id: number;
  productId: number;
  quantitySold: number;
  saleDate?: Date;
  uploaderId: string;
  product_name: string;
  totalPrice: number;
}
