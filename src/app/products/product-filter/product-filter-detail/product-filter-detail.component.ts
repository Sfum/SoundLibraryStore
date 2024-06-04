import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../../../models/brand';
import { Genre } from '../../../models/genre';
import { Router } from '@angular/router';
import firebase from 'firebase/compat';

@Component({
  selector: 'app-product-filter-detail',
  templateUrl: './product-filter-detail.component.html',
  styleUrl: './product-filter-detail.component.sass',
})
export class ProductFilterDetailComponent {
  // @ts-ignore
  user$: Observable<firebase.User>;

  @Input() filterField$?: Observable<Brand[]>;
  @Input() filterGenreField$?: Observable<Genre[]>;
  @Output() brandSelectedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() genreSelectedEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(public router: Router) {}

  optionBrandSelected(selectedBrandId: string) {
    this.brandSelectedEvent.emit(selectedBrandId);
  }

  optionGenreSelected(selectedGenreId: string) {
    this.genreSelectedEvent.emit(selectedGenreId);
  }
}
