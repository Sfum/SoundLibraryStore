import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Product} from "../../models/product";
import {SnackbarService} from "../../services/snackbar.service";

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.sass'
})
export class ProductEditComponent implements OnInit {
  productForm: FormGroup;
  // @ts-ignore
  productId: string;

  selectedBrandId: number | undefined;
  selectedGenreId: number | undefined;
  productEdit$: Observable<Product[]> | undefined;
  brands$ = this.productService.brands$
  genres$ = this.productService.genres$

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,

  ) {
    this.productForm = this.fb.group({

      product_name: ['', Validators.required],
      product_title: ['', Validators.required],
      product_description: ['', Validators.required],
      brandId: ['', Validators.required],
      genreId: ['', Validators.required],
      product_image: ['', Validators.required],
      in_bundle: ['', Validators.required],

    });
    this.productEdit$ = this.productService.getFilteredProductCollection();

  }


  ngOnInit(): void {
    // @ts-ignore
    this.productId = this.route.snapshot.paramMap.get('id');
    this.loadProduct();
  }

  optionBrandSelected(selectedSupplierId: number) {
    return this.productService.optionBrandSelected(selectedSupplierId);
  }

  optionGenreSelected(selectedCategoryId: number) {
    return this.productService.optionGenreSelected(selectedCategoryId);
  }

  loadProduct() {
    this.productService.getProduct(this.productId).subscribe(
      (product) => {
        if (product) {
          this.productForm.patchValue(product);
        } else {
          console.error('Product not found');
        }
      },
      (error) => {
        console.error('Error retrieving product: ', error);
      }
    );
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.productService.updateProduct(this.productId, this.productForm.value).subscribe(
        () => {
          window.location.reload();
        },
        (error) => {
          console.error('Error updating product: ', error);
        }
      );
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }
}
