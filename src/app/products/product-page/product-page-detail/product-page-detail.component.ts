import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../../models/product';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-page-detail',
  templateUrl: './product-page-detail.component.html',
  styleUrl: './product-page-detail.component.sass',
})
export class ProductPageDetailComponent implements OnInit {
  getId: any;
  product!: Product | undefined;
  relatedProducts: Product[] = [];
  relatedProductBrands: Product[] = [];

  @Output() addToWishlistEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() addToCartEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
  ) {
    this.getId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.params['id'];

    if (productId) {
      this.productService.getProduct(productId).subscribe((product) => {
        this.product = product;
        if (product) {
          // Fetch related products based on genreId
          this.productService
            .getProductsByGenre(product.genreId)
            .subscribe((products) => {
              this.relatedProducts = products.filter((p) => p.id !== productId); // Exclude current product
            });
          this.productService
            .getProductsByBrand(product.brandId)
            .subscribe((products) => {
              this.relatedProductBrands = products.filter(
                (p) => p.id !== productId,
              ); // Exclude current product
            });
        }
      });
    }
  }
  addToWishlist(product: Product) {
    this.addToWishlistEvent.emit(product);
  }
  addToCart(product: Product) {
    this.addToCartEvent.emit(product);
  }
}
