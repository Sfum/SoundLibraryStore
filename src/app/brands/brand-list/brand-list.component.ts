import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Brand } from '../../models/brand';
import { BrandService } from '../../services/brand.service';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.sass',
})
export class BrandListComponent implements OnInit {
  displayedColumns: string[] = ['brand_name', 'brand_description'];
  // @ts-ignore
  dataSource: MatTableDataSource<Brand>;
  brands: Brand[] = [];

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    this.brandService.getBrands().subscribe((brands) => {
      this.brands = brands;
      this.dataSource = new MatTableDataSource<Brand>(this.brands);
      this.dataSource.paginator = this.paginator;
    });
  }
}
