import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Sale } from '../../models/sale';
import { SalesService } from '../../services/sales.service';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase/compat';
import User = firebase.User;

@Component({
  selector: 'app-download-report',
  templateUrl: './download-report.component.html',
  styleUrl: './download-report.component.sass',
})
export class DownloadReportComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'product_name',
    'price',
    'quantitySold',
    'saleDate',
  ];
  dataSource = new MatTableDataSource<Sale>();

  constructor(
    private salesService: SalesService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user: User | null) => {
      if (user) {
        const uploaderId = user.uid;
        this.salesService.getSalesByUploader(uploaderId).subscribe((sales) => {
          this.dataSource.data = sales;
        });
      }
    });
  }
}
