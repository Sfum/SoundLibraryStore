import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';
import { Observable } from 'rxjs';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-on-sale-detail',
  templateUrl: './on-sale-detail.component.html',
  styleUrl: './on-sale-detail.component.sass',
})
export class OnSaleDetailComponent {
  @Input() products: Product[] = [];
  @Output() addToWishlistEvent: EventEmitter<Product> =
    new EventEmitter<Product>();
  @Output() addToCartEvent: EventEmitter<Product> = new EventEmitter<Product>();

  onSaleProducts$: Observable<Product[]> | null;

  constructor(private productService: ProductService) {
    this.onSaleProducts$ = this.productService.productsArrayOnSale$;
  }

  addToWishlist(product: Product) {
    this.addToWishlistEvent.emit(product);
  }

  addToCart(product: Product) {
    this.addToCartEvent.emit(product);
  }
}
