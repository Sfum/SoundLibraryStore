import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../../models/brand';
import { Genre } from '../../models/genre';
import { ProductService } from '../../services/product.service';
import { BrandService } from '../../services/brand.service';
import { GenreService } from '../../services/genre.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.sass',
})
export class ProductFilterComponent {
  // user$: Observable<firebase.User>;

  filterBrandField$: Observable<Brand[]>;
  filterGenreField$: Observable<Genre[]>;

  constructor(
    private productService: ProductService,
    private brandService: BrandService,
    private genreService: GenreService,
  ) {
    this.filterBrandField$ = this.brandService.getBrands();
    this.filterGenreField$ = this.genreService.getGenres();
  }

  optionBrandSelected(product: any) {
    return this.productService.optionBrandSelected(product);
  }

  optionGenreSelected(product: any) {
    return this.productService.optionGenreSelected(product);
  }
}
