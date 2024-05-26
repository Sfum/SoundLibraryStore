import { Component, Input, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { AppModule } from '../app.module';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { WishlistService } from '../services/wishlist.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-on-sale',
  templateUrl: './on-sale.component.html',
  styleUrl: './on-sale.component.sass',
})
export class OnsaleComponent implements OnInit {
  onSaleProducts$: Observable<Product[]> | null;

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService,
  ) {
    this.onSaleProducts$ = this.productService.productsArrayOnSale$;
  }

  ngOnInit(): void {}
}
