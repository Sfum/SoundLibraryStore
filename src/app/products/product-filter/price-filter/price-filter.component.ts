import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.sass'],
})
export class PriceFilterComponent {
  priceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
  ) {
    this.priceForm = this.fb.group({
      minPrice: [10, Validators.min(5)],
      maxPrice: [20, [Validators.max(30)]],
    });
  }

  onSubmit(): void {
    if (this.priceForm.valid) {
      const { minPrice, maxPrice } = this.priceForm.value;
      this.productService.optionPriceRangeSelected(minPrice, maxPrice);
    }
  }
}
