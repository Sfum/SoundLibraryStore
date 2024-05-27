import { Component, OnDestroy, OnInit } from '@angular/core';
import { GenreService } from '../../services/genre.service';
import { ProductService } from '../../services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Genre } from '../../models/genre';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-on-sale-genre',
  templateUrl: './on-sale-genre.component.html',
  styleUrl: './on-sale-genre.component.sass',
})
export class OnSaleGenreComponent implements OnInit, OnDestroy {
  genreOnSaleForm: FormGroup;
  genres$: Observable<Genre[]>;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private snackbarService: SnackbarService,
  ) {
    this.genreOnSaleForm = this.fb.group({
      genreId: ['', Validators.required],
      discountPercentage: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });

    this.genres$ = this.productService.genres$;
  }

  ngOnInit(): void {}

  setGenreOnSale(): void {
    if (this.genreOnSaleForm.invalid) {
      this.snackbarService.showSnackbar('Please fill in all required fields.');
      return;
    }

    const { genreId, discountPercentage } = this.genreOnSaleForm.value;
    this.subscriptions.add(
      this.productService.getProductsByGenre(genreId).subscribe((products) => {
        products.forEach((product) => {
          const salePrice = product.price * (1 - discountPercentage / 100);
          const updatedProduct = {
            ...product,
            salePrice,
            discountPercentage,
            onSale: true,
          };

          this.productService
            // @ts-ignore
            .updateProduct(product.id, updatedProduct)
            .subscribe({
              next: () => {
                console.log(`Product ${product.id} updated successfully.`);
              },
              error: (error) => {
                console.error(`Error updating product ${product.id}: `, error);
              },
            });
        });
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
