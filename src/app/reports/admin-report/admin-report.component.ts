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
  uploaderId: string = ''; // Define the uploaderId variable
  displayedColumns: string[] = [
    'id',
    'product_name',
    'quantitySold',
    'saleDate',
    'totalPrice',
    'uploaderId',
  ];
  dataSource = new MatTableDataSource<Sale>();

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    // Get the uploaderId
    this.salesService.getUserId().subscribe((uploaderId) => {
      if (uploaderId) {
        this.uploaderId = uploaderId;
        // Call getAllSales with the uploaderId
        this.salesService.getAllSales(this.uploaderId).subscribe((sales) => {
          this.dataSource.data = sales;
        });
      }
    });
  }
}
