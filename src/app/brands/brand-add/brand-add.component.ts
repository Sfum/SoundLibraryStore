import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../../models/brand';
import { Router } from '@angular/router';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';

@Component({
  selector: 'app-brand-add',
  templateUrl: './brand-add.component.html',
  styleUrl: './brand-add.component.sass',
})
export class BrandAddComponent implements OnInit {
  brandForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    public router: Router,
  ) {
    this.brandForm = this.formBuilder.group({
      _id: [''],
      id: ['', Validators.required],
      brand_name: ['', Validators.required],
      brand_description: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.brandForm.valid) {
      const newBrand: Brand = {
        _id: this.brandForm.value._id,
        id: this.brandForm.value.id,
        brand_name: this.brandForm.value.brand_name,
        brand_description: this.brandForm.value.brand_description,
      };
      this.brandService
        .addBrand(newBrand)
        .then(() => {
          console.log('Brand added successfully.');
          this.brandForm.reset();
          this.router.navigate(['/manage-brands']);
        })
        .catch((error) => {
          console.error('Error adding brand: ', error);
        });
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }
}
