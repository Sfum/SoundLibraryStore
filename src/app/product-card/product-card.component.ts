import {Component, OnInit} from '@angular/core';
import {ProductCardDetailComponent} from "./product-card-detail/product-card-detail.component";
import {Product} from "../models/product";
import {Observable} from "rxjs";
import {ProductService} from "../services/product.service";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.sass'
})
export class ProductCardComponent implements OnInit {

  productCollection$!: Observable<Product[]>;

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
    this.productCollection$ = this.productService.products$
  }

}
