import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable} from "rxjs";
import {Brand} from "../models/brand";
import {Genre} from "../models/genre";
import {Router} from "@angular/router";
import {AppModule} from "../app.module";
import {ProductService} from "../services/product.service";
import {BrandService} from "../services/brand.service";
import {GenreService} from "../services/genre.service";

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.sass'
})
export class ProductFilterComponent {
  // user$: Observable<firebase.User>;


  filterField$: Observable<Brand[]>
  filterGenreField$: Observable<Genre[]>

  constructor(private productService: ProductService,
              private brandService: BrandService,
              private genreService: GenreService) {
    this.filterField$ = this.brandService.getBrands()
    this.filterGenreField$ = this.genreService.getGenres()
  }

  optionBrandSelected(product: any) {
    return this.productService.optionBrandSelected(product)

  }
  optionGenreSelected(product: any) {
    return this.productService.optionGenreSelected(product)

  }
}
