import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable} from "rxjs";
import {Brand} from "../../models/brand";
import {Genre} from "../../models/genre";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-filter-detail',
  templateUrl: './product-filter-detail.component.html',
  styleUrl: './product-filter-detail.component.sass'
})
export class ProductFilterDetailComponent {
  // user$: Observable<firebase.User>;


  @Input() filterField$?: Observable<Brand[]>
  @Input() filterGenreField$?: Observable<Genre[]>

  @Output() brandSelectedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() genreSelectedEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(public router: Router) {
  }

  optionBrandSelected(selectedBrandId: number) {
    this.brandSelectedEvent.emit(selectedBrandId);
  }

  optionGenreSelected(selectedGenreId: number) {
    this.genreSelectedEvent.emit(selectedGenreId);
  }
}
