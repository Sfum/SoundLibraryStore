import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { SalesService } from '../../services/sales.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.sass'],
})
export class PaymentComponent {
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private cartService: CartService,
    private salesService: SalesService,
    private router: Router,
  ) {}

  simulatePayment(uploaderId: string): void {
    this.loading = true;
    this.errorMessage = null;

    // Sync cart with Firestore before processing the purchase
    this.cartService.syncCartWithFirestore().subscribe({
      next: () => {
        console.log('Cart synced with Firestore');
        this.salesService.handlePurchase().subscribe({
          next: () => {
            this.loading = false;
            console.log('Sales fetched successfully!');
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = error;
            console.error('Error processing payment:', error);
          },
        });
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error;
        console.error('Error syncing cart:', error);
      },
    });
  }
}
