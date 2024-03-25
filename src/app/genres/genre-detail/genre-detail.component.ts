import {Component, Input} from '@angular/core';
import {Product} from "../../models/product";
import {Genre} from "../../models/genre";

@Component({
  selector: 'app-genre-detail',
  templateUrl: './genre-detail.component.html',
  styleUrl: './genre-detail.component.sass'
})
export class GenreDetailComponent {

  @Input() genre!: Genre
  @Input() products!: Product[] | null;

  getGenreProducts(): Product[] {
    return this.products?.filter(product => product.genreId === this.genre.id) || [];
  }
}
