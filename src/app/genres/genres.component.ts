import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { Genre } from '../models/genre';
import { GenreService } from '../services/genre.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.sass',
})
export class GenresComponent implements OnInit {
  products$!: Observable<Product[]>;
  genres$!: Observable<Genre[]>;
  dataSource!: MatTableDataSource<Product>;
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private genresService: GenreService,
    public snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.genres$ = this.genresService.getGenres();
    this.products$ = this.productService.getProducts();
  }
  deleteGenre(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService
        .deleteProduct(id)
        .then(() => {
          this.snackbarService.showSnackbar('Product deleted successfully');
          this.productService.getProducts().subscribe((products) => {
            this.products = products;
            this.dataSource.data = this.products;
          });
        })
        .catch((error) => {
          this.snackbarService.showSnackbar('Failed to delete product');
        });
    }
  }
}
