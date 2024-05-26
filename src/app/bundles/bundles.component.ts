import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { WishlistService } from '../services/wishlist.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-bundles',
  templateUrl: './bundles.component.html',
  styleUrl: './bundles.component.sass',
})
export class BundlesComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.productService.getFilteredProductCollection().subscribe((products) => {
      this.products = products;
      this.filterProducts();
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(
      (product) => product.in_bundle,
    );
  }

  onAddToWishlist(product: Product) {
    this.wishlistService.addToWishlist(product);
  }

  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
