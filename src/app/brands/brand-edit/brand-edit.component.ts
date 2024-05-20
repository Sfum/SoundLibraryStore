import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BrandService} from "../../services/brand.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Brand} from "../../models/brand";

@Component({
  selector: 'app-brand-edit',
  templateUrl: './brand-edit.component.html',
  styleUrl: './brand-edit.component.sass'
})
export class BrandEditComponent implements OnInit {
  brandForm: FormGroup;
  // @ts-ignore
  brandId: string;

  brandEdit$: Observable<Brand[]> | undefined;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private route: ActivatedRoute,
    private router: Router,

  ) {
    this.brandForm = this.fb.group({
      brand_name: ['', Validators.required],
      brand_description: ['', Validators.required],

    });
    this.brandEdit$ = this.brandService.getBrands()

  }


  ngOnInit(): void {
    // @ts-ignore
    this.brandId = this.route.snapshot.paramMap.get('_id');
    this.loadBrand();
  }


  loadBrand() {
    this.brandService.getBrand(this.brandId).subscribe(
      (brand) => {
        if (brand) {
          const { id, ...brandData } = brand;
          this.brandForm.patchValue(brandData);
        } else {
          console.error('Brand not found');
        }
      },
      (error) => {
        console.error('Error retrieving brand: ', error);
      }
    );
  }

  onSubmit() {
    if (this.brandForm.valid) {
      this.brandService.updateBrand(this.brandId, this.brandForm.value).subscribe(
        () => {
          console.log('Brand updated successfully.');
          // Handle success, maybe redirect to the brand details page
          this.router.navigate(['/manage-products']);
        },
        (error) => {
          console.error('Error updating brand: ', error);
        }
      );
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }
}
