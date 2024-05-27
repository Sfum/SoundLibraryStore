import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { debounceTime, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.sass'],
})
export class ProductAddComponent implements OnInit {
  private onSubmitSubject = new Subject();
  productForm: FormGroup;
  productId: string | undefined;

  brands$ = this.productService.brands$;
  genres$ = this.productService.genres$;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private afs: AngularFirestore,
    private router: Router,
    private afStorage: AngularFireStorage,
  ) {
    this.productId = this.afs.createId();
    this.productForm = this.fb.group({
      product_name: ['', Validators.required],
      product_title: ['', Validators.required],
      product_description: ['', Validators.required],
      brandId: ['', Validators.required],
      genreId: ['', Validators.required],
      product_image: [''],
      in_bundle: [false, Validators.required],
      price: ['', Validators.required],
    });

    this.onSubmitSubject.pipe(debounceTime(1000)).subscribe(() => {
      this.onSubmit();
    });
  }

  ngOnInit() {
    this.productId = this.afs.createId();
  }

  onSubmitWithDebounce() {
    // @ts-ignore
    this.onSubmitSubject.next();
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

  onSubmit() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      this.productService
        .addProduct(productData)
        .then(() => {
          console.log('Product added successfully.');
          this.productForm.reset();
          this.router.navigate(['/manage-products']);
        })
        .catch((error) => {
          console.error('Error adding product: ', error);
        });
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }

  optionBrandSelected(selectedBrandId: number) {
    this.productService.optionBrandSelected(selectedBrandId);
  }

  optionGenreSelected(selectedGenreId: number) {
    this.productService.optionGenreSelected(selectedGenreId);
  }
}
