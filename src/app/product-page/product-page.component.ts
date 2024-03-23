import {Component, OnInit} from '@angular/core';
import {Product} from "../models/product";
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../services/product.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.sass'
})
export class ProductPageComponent implements OnInit {
  getId: any;
  product!: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
  ) {
    this.getId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.params['id'];

    if (productId) {
      this.productService.getProduct(productId).subscribe(product => {
        this.product = product;
      });
    }

  }

}
