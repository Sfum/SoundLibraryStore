import {Component, Input} from '@angular/core';
import {Product} from "../../models/product";

@Component({
  selector: 'app-product-card-detail',
  templateUrl: './product-card-detail.component.html',
  styleUrl: './product-card-detail.component.sass'
})
export class ProductCardDetailComponent {

  @Input() product!: Product

}
