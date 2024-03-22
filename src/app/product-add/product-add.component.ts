import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../services/product.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.sass'
})
export class ProductAddComponent implements OnInit {

  productForm: FormGroup;
  productId: string | undefined;

  constructor(private fb: FormBuilder,
              private productService: ProductService,
              private afs: AngularFirestore,
              private router: Router
              ) {
    this.productForm = this.fb.group({
      product_name: ['', Validators.required],
      product_title: ['', Validators.required],
      product_description: ['', Validators.required],
      brandId: ['', Validators.required],
      genreId: ['', Validators.required],
      product_image: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.productId = this.afs.createId()
  }

  onSubmit() {

    if (this.productForm.valid) {
      const productData = this.productForm.value;
      this.productService.addProduct(productData).then(() => {
        console.log('Product added successfully.');
        this.productForm.reset();
        this.router.navigate(['/'])
      })
        .catch(error => {
          console.error('Error adding product: ', error);
        });
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }
}
