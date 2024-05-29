import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../models/product';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-list-moderators',
  templateUrl: './product-list-moderators.component.html',
  styleUrls: ['./product-list-moderators.component.sass'],
})
export class ProductListModeratorsComponent implements OnInit {
  displayedColumns: string[] = [
    'product_image',
    'product_name',
    'genreId',
    'in_bundle',
    'onSale',
    'price',
    'salePrice',
    'discountPercentage',
    'delete',
  ];
  dataSource!: MatTableDataSource<Product>;
  products: Product[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.isModerator().subscribe((isModerator) => {
          if (isModerator) {
            this.productService
              .getProductsByUploader(user.uid)
              .subscribe((products) => {
                this.products = products;
                this.dataSource = new MatTableDataSource<Product>(
                  this.products,
                );
                this.dataSource.paginator = this.paginator;
              });
          }
        });
      }
    });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService
        .deleteProduct(id)
        .then(() => {
          this.authService.user$.subscribe((user) => {
            if (user) {
              this.productService
                .getProductsByUploader(user.uid)
                .subscribe((products) => {
                  this.products = products;
                  this.dataSource.data = this.products;
                });
            }
          });
        })
        .catch((error) => {
          console.error('Failed to delete product', error);
        });
    }
  }
}
