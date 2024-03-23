import {Component, OnInit} from '@angular/core';
import {Product} from "../models/product";
import {Observable} from "rxjs";
import {ProductService} from "../services/product.service";
import {BrandService} from "../services/brand.service";
import {GenreService} from "../services/genre.service";
import {Brand} from "../models/brand";
import {Genre} from "../models/genre";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.sass'
})
export class ProductCardComponent implements OnInit {

  productCollection$!: Observable<Product[]>;
  brandCollection$!: Observable<Brand[]>;
  genreCollection$!: Observable<Genre[]>;

  constructor(private productService: ProductService,
              private brandService: BrandService,
              private genreService: GenreService) {
  }

  ngOnInit() {
    this.productCollection$ = this.productService.productsArrayFiltered$
    this.brandCollection$ = this.brandService.brands$
    this.genreCollection$ = this.genreService.genres$
  }
}
