import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Product, ProductComment } from '../../../models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
// @ts-ignore
import { DocumentSnapshot } from 'firebase/compat/firestore';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-product-page-detail',
  templateUrl: './product-page-detail.component.html',
  styleUrls: ['./product-page-detail.component.sass'],
})
export class ProductPageDetailComponent implements OnInit {
  relatedProductsByGenre: Product[] = [];
  relatedProductsByBrand: Product[] = [];
  comments: ProductComment[] = [];
  paginatedComments: ProductComment[] = [];

  pageSize: number = 5; // Number of comments per page
  currentPage: number = 0; // Current page index

  commentForm!: FormGroup;
  product!: Product | undefined;
  userId!: string;
  userName!: string;
  averageRating: number = 0;

  @Output() addWishlistEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() addCartEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.params['id'];

    if (productId) {
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

    this.authService.user$.subscribe((user) => {
      this.userId = user?.uid ?? '';
      this.userName = user?.displayName ?? 'Anonymous';
    });
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

  navigateToProduct(productId: number): void {
    this.router.navigateByUrl(`/products/${productId}`).then(() => {
      window.location.reload();
    });
  }
}
