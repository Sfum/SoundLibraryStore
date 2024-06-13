import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Sale } from '../../models/sale';
import { SalesService } from '../../services/sales.service';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase/compat';
import User = firebase.User;
import { Timestamp } from 'firebase/firestore';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'app-download-report',
  templateUrl: './download-report.component.html',
  styleUrls: ['./download-report.component.sass'],
})
export class DownloadReportComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'product_name',
    'totalPrice',
    'quantitySold',
    'saleDate',
  ];
  dataSource = new MatTableDataSource<Sale>();
  sales: Sale[] = [];

  constructor(
    private salesService: SalesService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user: User | null) => {
      if (user) {
        const uploaderId = user.uid;
        this.salesService.getSalesByUploader(uploaderId).subscribe((sales) => {
          this.sales = sales.map((sale) => ({
            ...sale,
            saleDate: (sale.saleDate as unknown as Timestamp).toDate(),
          }));
          this.dataSource.data = this.sales;
        });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByDate(period: string): void {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(0); // No filter
    }

    this.dataSource.data = this.sales.filter(
      (sale) => (sale.saleDate as Date) >= startDate,
    );
  }
}
