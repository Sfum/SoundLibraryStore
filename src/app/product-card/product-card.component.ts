import {Component, OnInit} from '@angular/core';
import {Product} from "../models/product";
import {Observable} from "rxjs";
import {ProductService} from "../services/product.service";
import {BrandService} from "../services/brand.service";
import {GenreService} from "../services/genre.service";
import {TypeService} from "../services/type.service";
import {Brand} from "../models/brand";
import {Genre} from "../models/genre";
import {ProductType} from "../models/type";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.sass'
})
export class ProductCardComponent implements OnInit {

  productCollection$!: Observable<Product[]>;
  brandCollection$!: Observable<Brand[]>;
  genreCollection$!: Observable<Genre[]>;
  typeCollection$!: Observable<ProductType[]>;

  constructor(private productService: ProductService,
              private brandService: BrandService,
              private genreService: GenreService,
              private typeService: TypeService) {
  }

  ngOnInit() {
    this.productCollection$ = this.productService.productsArrayFiltered$
    this.brandCollection$ = this.brandService.brands$
    this.genreCollection$ = this.genreService.genres$
    this.typeCollection$ = this.typeService.types$
  }
}
