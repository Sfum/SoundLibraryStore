import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../../../models/brand';
import { Genre } from '../../../models/genre';
import { Router } from '@angular/router';
import firebase from 'firebase/compat';
import { GenreService } from '../../../services/genre.service';
import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-product-filter-detail',
  templateUrl: './product-filter-detail.component.html',
  styleUrl: './product-filter-detail.component.sass',
})
export class ProductFilterDetailComponent {
  // @ts-ignore
  user$: Observable<firebase.User>;
  @Input() filterGenreField$: Observable<Genre[]> | undefined;
  @Input() filterBrandField$: Observable<Brand[]> | undefined;
  selectedBrandIds: Set<number> = new Set<number>();

  @Output() brandSelectedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() genreSelectedEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public router: Router,
    private genreService: GenreService,
    private brandService: BrandService,
  ) {}

  ngOnInit() {
    // Initialize observables with your data fetching logic
    this.filterGenreField$ = this.fetchGenres();
    this.filterBrandField$ = this.fetchBrands();
  }

  fetchGenres(): Observable<Genre[]> {
    return this.genreService.getGenres();
  }

  fetchBrands(): Observable<Brand[]> {
    return this.brandService.getBrands();
  }

  optionGenreSelected(selectedGenreId: number) {
    this.genreSelectedEvent.emit(selectedGenreId);
  }
  optionBrandSelected(selectedBrandId: number) {
    this.brandSelectedEvent.emit(selectedBrandId);
  }

  onBrandCheckboxChange(event: any, brandId: number) {
    if (event.checked) {
      this.selectedBrandIds.add(brandId);
    } else {
      this.selectedBrandIds.delete(brandId);
    }
    this.updateSelectedBrands();
  }

  updateSelectedBrands() {
    this.brandSelectedEvent.emit(Array.from(this.selectedBrandIds));
  }
}
