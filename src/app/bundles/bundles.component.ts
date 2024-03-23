import {Component, OnInit} from '@angular/core';
import {Product} from "../models/product";
import {ProductService} from "../services/product.service";

@Component({
  selector: 'app-bundles',
  templateUrl: './bundles.component.html',
  styleUrl: './bundles.component.sass'
})
export class BundlesComponent implements OnInit{
  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }
}
