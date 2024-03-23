import {Component, OnInit, ViewChild} from '@angular/core';
import {Product} from "../models/product";
import {ProductService} from "../services/product.service";
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.sass'
})
export class ProductListComponent  implements OnInit {
  displayedColumns: string[] = [
    'id',
    'product_name',
    'product_title',
    'product_description',
    'brandId',
    'genreId',
    'product_image',
    'in_bundle'
  ];
  // @ts-ignore
  dataSource: MatTableDataSource<Product>;
  products: Product[] = [];

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private productService: ProductService,
              private router: Router) {}

  ngOnInit(): void {
    this.productService.getFilteredProductCollection().subscribe((products) => {
      this.products = products;
      this.dataSource = new MatTableDataSource<Product>(this.products);
      this.dataSource.paginator = this.paginator;
    });
  }

  onCreateProduct() {
    this.router.navigate(['/create-product'])
  }
}
