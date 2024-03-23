import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../models/product";

@Component({
  selector: 'app-bundle-detail',
  templateUrl: './bundle-detail.component.html',
  styleUrl: './bundle-detail.component.sass'
})
export class BundleDetailComponent implements OnInit {
  @Input() products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor() { }

  ngOnInit(): void {
    this.filterProducts();
  }

  ngOnChanges(): void {
    this.filterProducts();
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => product.in_bundle);
  }
}
