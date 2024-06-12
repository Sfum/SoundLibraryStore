import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product, ProductComment } from '../../../models/product';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

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
  comments: ProductComment[] = [];
  commentForm!: FormGroup;
  userId!: string;
  userName!: string;

  @Input() productId!: string;
  @Output() addWishlistEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() addCartEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    // Get productId from route parameters
    this.productId = this.route.snapshot.params['id'];

    // Initialize comment form
    this.initCommentForm();

    // Fetch product details and comments
    this.loadProductAndComments(this.productId);

    // Fetch related products
    this.fetchRelatedProducts();
  }

  private initCommentForm(): void {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    });
  }

  private loadProductAndComments(productId: string): void {
    // Fetch product details
    this.productService.getProduct(productId).subscribe((product) => {
      if (product) {
        this.product = product;
      } else {
        console.error(`Product with ID ${productId} not found.`);
      }
    });

    // Load comments
    this.loadComments(productId);
  }

  private loadComments(productId: string): void {
    this.productService.getComments(productId).subscribe((comments) => {
      this.comments = comments;
    });
  }

  private fetchRelatedProducts(): void {
    if (this.product) {
      const productId = this.product.id; // Assuming product id is stored in `id` property

      // Fetch related products based on genreId
      this.productService
        .getProductsByGenre(this.product.genreId)
        .subscribe((products) => {
          this.relatedProducts = products.filter((p) => p.id !== productId);
        });
    }
  }

  addComment(): void {
    if (this.commentForm.invalid) {
      return;
    }

    const comment: ProductComment = {
      userId: this.userId,
      userName: this.userName,
      comment: this.commentForm.value.comment,
      timestamp: new Date(),
    };

    this.productService.addComment(this.productId, comment).then(() => {
      // Reload comments after adding
      this.loadComments(this.productId);

      // Reset comment form
      this.commentForm.reset();
    });
  }
  // Fetch userId and userName from AuthService
  private fetchUserData(): void {
    this.authService.user$.subscribe((user) => {
      this.userId = user?.uid ?? '';
      this.userName = user?.displayName ?? 'Anonymous';
    });
  }
  addToWishlist(product: Product) {
    this.addWishlistEvent.emit(product);
  }
  addToCart(product: Product) {
    this.addCartEvent.emit(product);
  }
}
