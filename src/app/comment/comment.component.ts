import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { ProductComment, Product } from '../models/product';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.sass'],
})
export class CommentComponent implements OnInit {
  @Input() productId!: string;
  comments: ProductComment[] = [];
  commentForm!: FormGroup;
  userId!: string;
  userName!: string;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    });

    this.authService.user$.subscribe((user) => {
      this.userId = user?.uid ?? '';
      this.userName = user?.displayName ?? 'Anonymous';
    });

    this.loadComments();
  }

  loadComments() {
    this.productService.getComments(this.productId).subscribe((comments) => {
      this.comments = comments;
    });
  }

  addComment() {
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
      this.loadComments();
      this.commentForm.reset();
    });
  }
}
