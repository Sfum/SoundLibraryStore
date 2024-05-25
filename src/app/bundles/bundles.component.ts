import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { BrandService } from '../services/brand.service';
import { GenreService } from '../services/genre.service';
import { WishlistService } from '../services/wishlist.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-bundles',
  templateUrl: './bundles.component.html',
  styleUrl: './bundles.component.sass',
})
export class BundlesComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.productService.getFilteredProductCollection().subscribe((products) => {
      this.products = products;
    });
  }
  onAddToWishlist(product: any) {
    this.wishlistService.addToWishlist(product);
  }

  onAddToCart(product: any) {
    this.cartService.addToCart(product);
  }
}
