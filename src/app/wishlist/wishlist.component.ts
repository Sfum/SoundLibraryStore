import {Component, OnInit} from '@angular/core';
import {Product} from "../models/product";
import {ProductService} from "../services/product.service";
import {WishlistService} from "../services/wishlist.service";

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.sass'
})
export class WishlistComponent implements OnInit {

  products: Product[] = [];
  products$ = this.productService.products$

  constructor(
              private wishlistService: WishlistService,
              private productService: ProductService) {
  }
  ngOnInit() {
    this.wishlistService.loadCart();
    this.products = this.wishlistService.getProduct();
  }

  removeFromWishlist(product: Product) {
    this.wishlistService.removeProduct(product);
  }

}
