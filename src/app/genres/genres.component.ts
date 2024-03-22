import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Brand} from "../models/brand";
import {Product} from "../models/product";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {ProductService} from "../services/product.service";
import {BrandService} from "../services/brand.service";
import {Genre} from "../models/genre";
import {GenreService} from "../services/genre.service";

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.sass'
})
export class GenresComponent implements OnInit{

  products$!: Observable<Product[]>
  genres$!: Observable<Genre[]>

  constructor(private db: AngularFireDatabase,
              private productService: ProductService,
              private genresService: GenreService) { }

  ngOnInit(): void {
    this.genres$ = this.genresService.getGenres()
    this.products$ = this.productService.getProducts()
  }

}
