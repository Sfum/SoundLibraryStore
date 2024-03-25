import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../models/product";
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../services/product.service";
import {Genre} from "../../models/genre";

@Component({
  selector: 'app-product-page-detail',
  templateUrl: './product-page-detail.component.html',
  styleUrl: './product-page-detail.component.sass'
})
export class ProductPageDetailComponent  implements OnInit {
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
