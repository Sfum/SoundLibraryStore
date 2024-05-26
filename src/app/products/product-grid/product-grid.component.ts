import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';
import { AppModule } from '../../app.module';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.sass',
})
export class ProductGridComponent {
  @Input() products: Product[] = [];
  @Output() addToWishlistEvent: EventEmitter<Product> =
    new EventEmitter<Product>();
  @Output() addToCartEvent: EventEmitter<Product> = new EventEmitter<Product>();

  onAddToWishlist(product: Product) {
    this.addToWishlistEvent.emit(product);
  }

  onAddToCart(product: Product) {
    this.addToCartEvent.emit(product);
  }
}
