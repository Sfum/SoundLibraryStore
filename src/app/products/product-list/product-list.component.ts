import {Component, OnInit, ViewChild} from '@angular/core';
import {Product} from "../../models/product";
import {ProductService} from "../../services/product.service";
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {SnackbarService} from "../../services/snackbar.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.sass'
})
export class ProductListComponent  implements OnInit {
  displayedColumns: string[] = [
    'id',
    'product_name',
    'genreId',
    'product_image',
    'in_bundle',
    'price',
    'delete'
  ];
  // @ts-ignore
  dataSource: MatTableDataSource<Product>;
  products: Product[] = [];

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private productService: ProductService,
              private router: Router,
              public snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.productService.getFilteredProductCollection().subscribe((products) => {
      this.products = products;
      this.dataSource = new MatTableDataSource<Product>(this.products);
      this.dataSource.paginator = this.paginator;
    });
  }
  deleteProduct(id: string) {
    if(confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).then(() => {
        this.snackbarService.showSnackbar('Product deleted successfully');
        this.productService.getProducts(); // Reload the products after deletion
      }).catch(error => {
        this.snackbarService.showSnackbar('Failed to delete product'
        );
      });
    }
  }
}
