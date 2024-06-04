import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-related',
  templateUrl: './product-related.component.html',
  styleUrl: './product-related.component.sass',
})
export class ProductRelatedComponent {
}
