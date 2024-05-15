import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from "../../models/product";

@Component({
  selector: 'app-shopping-cart-detail',
  templateUrl: './shopping-cart-detail.component.html',
  styleUrl: './shopping-cart-detail.component.sass'
})
export class ShoppingCartDetailComponent {

  @Input() products!: Product[];
  @Output() addToWishListEvent: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() removeFromCartEvent: EventEmitter<Product> = new EventEmitter<Product>();

  removeFromCart(product: Product) {
    this.removeFromCartEvent.emit(product);
  }

  addToWishlist(product: Product) {
    this.addToWishListEvent.emit(product);
  }

}
