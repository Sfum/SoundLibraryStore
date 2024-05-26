import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-bundle-detail',
  templateUrl: './bundle-detail.component.html',
  styleUrl: './bundle-detail.component.sass',
})
export class BundleDetailComponent implements OnInit, OnChanges {
  @Input() products: Product[] = [];
  @Output() addToWishlistEvent: EventEmitter<Product> =
    new EventEmitter<Product>();
  @Output() addToCartEvent: EventEmitter<Product> = new EventEmitter<Product>();

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) {
      this.products = changes['products'].currentValue;
    }
  }

  addToWishlist(product: Product) {
    this.addToWishlistEvent.emit(product);
  }

  addToCart(product: Product) {
    this.addToCartEvent.emit(product);
  }
}
