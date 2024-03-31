import {Component, OnInit} from '@angular/core';
import {Product} from "../../models/product";
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../services/product.service";
import {Observable} from "rxjs";
import {Genre} from "../../models/genre";
import {GenreService} from "../../services/genre.service";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.sass'
})
export class ProductPageComponent  implements OnInit{
  products$!: Observable<Product[]>;
  genres$!: Observable<Genre[]>;

  constructor(private productService: ProductService,
              private genresService: GenreService) { }

  ngOnInit(): void {
    this.genres$ = this.genresService.getGenres();
    this.products$ = this.productService.getProducts();
  }
}