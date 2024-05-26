import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.sass',
})
export class ShoppingCartComponent implements OnInit {
  products: Product[] = [];
  products$ = this.productService.products$;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.cartService.loadCart();
    this.products = this.cartService.getProduct();
  }
  addToWishlist(product: any) {
    this.removeFromCart(product);
    this.wishlistService.addToWishlist(product);
  }
  removeFromCart(product: any) {
    this.cartService.removeProduct(product);
    this.products = this.cartService.getProduct();
  }

  onCheckout() {
    localStorage.setItem('cart_items', JSON.stringify(this.total));
    this.router.navigate(['/payment']);
  }

  get total() {
    return this.products?.reduce(
      (sum, product) => ({
        quantity: 1,
        // @ts-ignore
        salePrice: sum.salePrice + product.quantity * product.salePrice,
      }),
      { quantity: 1, salePrice: 0 },
    ).salePrice;
  }
}
