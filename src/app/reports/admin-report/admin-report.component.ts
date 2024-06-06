import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Sale } from '../../models/sale';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrl: './admin-report.component.sass',
})
export class AdminReportComponent implements OnInit {
  displayedColumns: string[] = ['id', 'productId', 'quantitySold', 'saleDate'];
  dataSource = new MatTableDataSource<Sale>();

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.salesService.getAllSales().subscribe((sales) => {
      this.dataSource.data = sales;
    });
  }
}
