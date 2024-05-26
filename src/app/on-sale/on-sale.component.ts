import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { BrandService } from '../services/brand.service';
import { GenreService } from '../services/genre.service';
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
  onAddToWishlist(product: any) {
    this.wishlistService.addToWishlist(product);
  }

  onAddToCart(product: any) {
    this.cartService.addToCart(product);
  }
}
