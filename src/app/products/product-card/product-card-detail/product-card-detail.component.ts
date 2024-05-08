import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from "../../../models/product";

@Component({
  selector: 'app-product-card-detail',
  templateUrl: './product-card-detail.component.html',
  styleUrl: './product-card-detail.component.sass'
})
export class ProductCardDetailComponent {

  @Input() product!: Product
  @Output() addToWishlistEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() addToCartEvent: EventEmitter<any> = new EventEmitter<any>();


  addToWishlist(product: Product) {
    this.addToWishlistEvent.emit(product);
  }

  addToCart(product: Product) {
    this.addToCartEvent.emit(product);
  }

}
