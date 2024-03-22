import {Component, Input} from '@angular/core';
import {Brand} from "../../models/brand";
import {Product} from "../../models/product";

@Component({
  selector: 'app-brand-detail',

  templateUrl: './brand-detail.component.html',
  styleUrl: './brand-detail.component.sass'
})
export class BrandDetailComponent {
  @Input() brand!: Brand;
  @Input() products!: Product[] | null;

  getBrandProducts(): Product[] {
    return this.products?.filter(product => product.brandId === this.brand.id) || [];
  }
}
