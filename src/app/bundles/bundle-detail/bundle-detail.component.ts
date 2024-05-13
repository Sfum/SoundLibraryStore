import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Product} from "../../models/product";

@Component({
  selector: 'app-bundle-detail',
  templateUrl: './bundle-detail.component.html',
  styleUrl: './bundle-detail.component.sass'
})
export class BundleDetailComponent implements OnInit {
  @Input() products: Product[] = [];
  filteredProducts: Product[] = [];

  @Input() product!: Product
  @Output() addToWishlistEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() addToCartEvent: EventEmitter<any> = new EventEmitter<any>();

  addToWishlist(product: Product) {
    this.addToWishlistEvent.emit(product);
  }

  addToCart(product: Product) {
    this.addToCartEvent.emit(product);
  }

  constructor() { }

  ngOnInit(): void {
    this.filterProducts();
  }

  ngOnChanges(): void {
    this.filterProducts();
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => product.in_bundle);
  }
}
