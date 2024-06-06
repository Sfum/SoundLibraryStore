import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Sale } from '../../models/sale';
import { SalesService } from '../../services/sales.service';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase/compat';
import User = firebase.User;

@Component({
  selector: 'app-moderator-report',
  templateUrl: './moderator-report.component.html',
  styleUrl: './moderator-report.component.sass',
})
export class ModeratorReportComponent implements OnInit {
  displayedColumns: string[] = ['id', 'productId', 'quantitySold', 'saleDate'];
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
