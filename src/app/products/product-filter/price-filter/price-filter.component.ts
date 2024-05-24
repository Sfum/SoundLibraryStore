import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.sass']
})
export class PriceFilterComponent implements OnInit {
  priceForm: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.priceForm = this.fb.group({
      minPrice: [0, Validators.min(0)],
      maxPrice: [Infinity, [ Validators.min(0)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.priceForm.valid) {
      const { minPrice, maxPrice } = this.priceForm.value;
      this.productService.optionPriceRangeSelected(minPrice, maxPrice);
    }
  }
}
