import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SnackbarService } from '../../services/snackbar.service';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase/compat';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.sass'],
})
export class ProductListComponent implements OnInit {
  @Input() product!: Product;

  displayedColumns: string[] = [
    'product_image',
    'product_name',
    'date_created',
    'in_bundle',
    'onSale',
    'price',
    'discountPercentage',
    'delete',
  ];
  dataSource!: MatTableDataSource<Product>;
  products: Product[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productService: ProductService,
    private router: Router,
    public snackbarService: SnackbarService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.productService
          .getFilteredProductCollection()
          .subscribe((products) => {
            // Convert Firestore Timestamp to JavaScript Date
            this.products = products.map((product) => ({
              ...product,
              date_created: (
                product.date_created as unknown as Timestamp
              ).toDate(),
            }));
            this.dataSource = new MatTableDataSource<Product>(this.products);
            this.dataSource.paginator = this.paginator;
          });
      }
    });
    this.productService.getFilteredProductCollection().subscribe((products) => {
      this.products = products;
      this.dataSource = new MatTableDataSource<Product>(this.products);
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteProduct(id: string) {
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
