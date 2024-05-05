import {Component, OnInit} from '@angular/core';
import {Product} from "../../models/product";
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-product-related',
  templateUrl: './product-related.component.html',
  styleUrl: './product-related.component.sass'
})
export class ProductRelatedComponent implements OnInit {
  getId: any;
  product!: Product | undefined;
  relatedProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    this.getId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.params['id'];

    if (productId) {
      this.productService.getProduct(productId).subscribe(product => {
        this.product = product;
        if (product) {
          // Fetch related products based on genreId
          this.productService.getRelatedProducts(product.genreId).subscribe(products => {
            this.relatedProducts = products.filter(p => p.id !== productId); // Exclude current product
          });
        }
      });
    }
  }
}
