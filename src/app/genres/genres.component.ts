import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Product} from "../models/product";
import {ProductService} from "../services/product.service";
import {Genre} from "../models/genre";
import {GenreService} from "../services/genre.service";

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.sass',
})
export class GenresComponent implements OnInit{
  products$!: Observable<Product[]>;
  genres$!: Observable<Genre[]>;

  constructor(private productService: ProductService,
              private genresService: GenreService) { }

  ngOnInit(): void {
    this.genres$ = this.genresService.getGenres();
    this.products$ = this.productService.getProducts();
  }
}
