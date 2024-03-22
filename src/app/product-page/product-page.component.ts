import {Component, OnInit} from '@angular/core';
import {Product} from "../models/product";
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../services/product.service";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.sass'
})
export class ProductPageComponent implements OnInit {
  product!: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['productId'];
      this.productService.getProduct(productId).subscribe(product => {
        this.product = product;
      });
    });
  }
}
