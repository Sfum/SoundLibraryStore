import { Component } from '@angular/core';
import { Product } from '../models/product';
import { WishlistService } from '../services/wishlist.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-on-sale',
  templateUrl: './on-sale.component.html',
  styleUrl: './on-sale.component.sass',
})
export class OnSaleComponent {
  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
  ) {}

  onAddToWishlist(product: Product) {
    this.wishlistService.addToWishlist(product);
  }

  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
