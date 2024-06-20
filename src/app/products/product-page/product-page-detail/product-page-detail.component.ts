import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Product, ProductComment } from '../../../models/product';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';

// @ts-ignore
import { DocumentSnapshot } from 'firebase/compat/firestore';
@Component({
  selector: 'app-product-page-detail',
  templateUrl: './product-page-detail.component.html',
  styleUrls: ['./product-page-detail.component.sass'],
})
export class ProductPageDetailComponent implements OnInit {
  relatedProductsByGenre: Product[] = [];
  relatedProductsByBrand: Product[] = [];
  product!: Product | undefined;
  userId!: string;

  @Output() addWishlistEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() addCartEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.params['id'];
    if (productId) {
      // Load product details and related products
      this.productService
        .getProductSnapShot(productId)
        .subscribe((snapshot: DocumentSnapshot<any>) => {
          const productData = snapshot.data();
          if (productData) {
            this.product = { id: snapshot.id, ...productData } as Product;
            this.fetchRelatedProductsByGenre();
            this.fetchRelatedProductsByBrand();
          }
        });
    }
  }

  fetchRelatedProductsByGenre(): void {
    if (this.product) {
      this.productService
        .getProductsByGenre(this.product.genreId)
        .subscribe((products) => {
          this.relatedProductsByGenre = products.filter(
            (p) => p.id !== this.product?.id,
          );
        });
    }
  }
  fetchRelatedProductsByBrand(): void {
    if (this.product) {
      this.productService
        .getProductsByBrand(this.product.brandId)
        .subscribe((products) => {
          this.relatedProductsByBrand = products.filter(
            (p) => p.id !== this.product?.id,
          );
        });
    }
  }

  addToWishlist(product: Product) {
    this.addWishlistEvent.emit(product);
  }

  addToCart(product: Product) {
    this.addCartEvent.emit(product);
  }
}
