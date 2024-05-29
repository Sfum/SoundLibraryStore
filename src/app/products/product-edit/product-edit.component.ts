import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../../models/product';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.sass'],
})
export class ProductEditComponent implements OnInit {
  productForm: FormGroup;
  // @ts-ignore
  productId: string;

  selectedBrandId: number | undefined;
  selectedGenreId: number | undefined;
  productEdit$: Observable<Product[]> | undefined;
  brands$ = this.productService.brands$;
  genres$ = this.productService.genres$;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private afStorage: AngularFireStorage,
  ) {
    this.productForm = this.fb.group({
      product_name: ['', Validators.required],
      product_title: ['', Validators.required],
      product_description: ['', Validators.required],
      brandId: [''],
      genreId: ['', Validators.required],
      product_image: ['', Validators.required],
      in_bundle: [false, Validators.required],
      price: ['', Validators.required],
      discountPercentage: [''],
      salePrice: [''],
      onSale: [false],
    });
    this.productEdit$ = this.productService.productsArrayFiltered$;
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `products/${this.productId}/${file.name}`;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, file);

      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(
              (url) => {
                this.productForm.patchValue({ product_image: url });
                console.log('File URL:', url);
              },
              (error) => {
                console.error('Error getting download URL:', error);
              },
            );
          }),
        )
        .subscribe(
          (snapshot) => {
            console.log('Upload progress:', snapshot);
          },
          (error) => {
            console.error('Upload error:', error);
          },
        );
    } else {
      console.error('No file selected');
    }
  }

  ngOnInit(): void {
    // @ts-ignore
    this.productId = this.route.snapshot.paramMap.get('id');
    this.loadProduct();
    this.productForm.get('onSale')?.valueChanges.subscribe((onSale) => {
      const discountPercentageControl =
        this.productForm.get('discountPercentage');
      const salePriceControl = this.productForm.get('salePrice');
      if (onSale) {
        discountPercentageControl?.enable();
        salePriceControl?.enable();
      } else {
        discountPercentageControl?.disable();
        salePriceControl?.disable();
      }
    });
  }

  optionBrandSelected(selectedBrandId: number) {
    return this.productService.optionBrandSelected(selectedBrandId);
  }

  optionGenreSelected(selectedGenreId: number) {
    return this.productService.optionGenreSelected(selectedGenreId);
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
      },
    );
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.productService
        .updateProduct(this.productId, this.productForm.value)
        .subscribe(
          () => {
            window.location.reload();
          },
          (error) => {
            console.error('Error updating product: ', error);
          },
        );
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }
}
