import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { Product, ProductComment } from '../../models/product';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-product-comment',
  templateUrl: './product-comment.component.html',
  styleUrl: './product-comment.component.sass',
})
export class ProductCommentComponent implements OnInit {
  comments: ProductComment[] = [];

  product!: Product | undefined;
  commentForm!: FormGroup;
  userId!: string;
  userName!: string;

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
  }
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  loadComments(productId: string) {
    this.productService.getComments(productId).subscribe((comments) => {
      this.comments = comments.map((comment) => {
        // Check if date_created is an instance of Timestamp before converting
        const timestamp =
          comment.date_created instanceof Timestamp
            ? comment.date_created.toDate()
            : comment.date_created;

        return {
          ...comment,
          date_created: timestamp,
        };
      });
    });
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
    });
  }
}
