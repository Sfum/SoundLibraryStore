import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Product, ProductComment } from '../../../models/product';
import { ActivatedRoute } from '@angular/router';
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

  product!: Product | undefined;
  commentForm!: FormGroup;
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
            this.loadComments(productId); // Load comments after product data is loaded
          }
        });
    }

    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
      rating: [5, Validators.required], // Default rating to 5 stars
    });

    this.authService.user$.subscribe((user) => {
      this.userId = user?.uid ?? '';
      this.userName = user?.displayName ?? 'Anonymous';
    });

    this.loadComments(productId);
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

  loadComments(productId: string) {
    this.productService.getComments(productId).subscribe((comments) => {
      this.comments = comments.map((comment) => {
        // Check if date_created is an instance of Timestamp before converting
        const timestamp =
          comment.date_created instanceof Timestamp
            ? comment.date_created.toDate()
            : comment.date_created;

        // Format the date as needed
        const formattedDate = timestamp.toLocaleString();

        return {
          ...comment,
          date_created: formattedDate,
        };
      });
      this.calculateAverageRating();
      this.updatePaginatedComments();
    });
  }

  calculateAverageRating() {
    if (this.comments.length === 0) {
      this.averageRating = 0;
      return;
    }

    const totalRating = this.comments.reduce(
      (acc, comment) => acc + comment.rating,
      0,
    );
    this.averageRating = totalRating / this.comments.length;
  }

  setRating(rating: number) {
    this.commentForm.patchValue({ rating });
  }

  addComment(productId: string) {
    if (this.commentForm.invalid) {
      return;
    }

    const comment: ProductComment = {
      userId: this.userId,
      userName: this.userName,
      comment: this.commentForm.value.comment,
      rating: this.commentForm.value.rating,
      date_created: new Date(),
    };

    this.productService.addComment(productId, comment).then(() => {
      this.commentForm.reset();
      this.loadComments(productId);
    });
  }

  updatePaginatedComments() {
    const startIndex = this.currentPage * this.pageSize;
    this.paginatedComments = this.comments.slice(
      startIndex,
      startIndex + this.pageSize,
    );
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.updatePaginatedComments();
  }

  addToWishlist(product: Product) {
    this.addWishlistEvent.emit(product);
  }

  addToCart(product: Product) {
    this.addCartEvent.emit(product);
  }
}
