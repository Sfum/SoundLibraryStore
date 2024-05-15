// product-carousel.component.ts

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-product-carousel',
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.sass']
})
export class ProductCarouselComponent implements OnInit {
  productImages$: Observable<any[]> | undefined; // Assuming your product images are stored as an array in Firebase

  constructor(
              private productService: ProductService) { }

  ngOnInit(): void {
    this.productImages$ = this.productService.getProducts()

  }
}
