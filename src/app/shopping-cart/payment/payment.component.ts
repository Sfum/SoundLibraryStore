import { Component, OnInit } from '@angular/core';
import {
  loadStripe,
  Stripe,
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { StripeService } from '../../services/stripe.service';
import { environment } from '../../../environments/environment';
import { SalesService } from '../../services/sales.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.sass'],
})
export class PaymentComponent implements OnInit {
  stripe: Stripe | null = null;
  card: any;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private salesService: SalesService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripePublicKey);

    // @ts-ignore
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');
  }

  handlePayment(event: Event) {
    event.preventDefault();
    this.loading = true;
    this.errorMessage = null;

    if (this.stripe) {
      this.stripe.createToken(this.card).then((result) => {
        this.loading = false;
        if (result.error) {
          // @ts-ignore
          this.errorMessage = result.error.message;
        } else {
          this.processPayment(result.token);
        }
      });
    }
  }

  processPayment(token: any) {
    // Handle the payment process with your server here
    console.log('Token:', token);
    alert('Payment processed successfully!');
  }
  simulatePayment(): void {
    this.loading = true;
    this.errorMessage = null;

    this.salesService.handlePurchase().subscribe(
      () => {
        this.loading = false;
        // Redirect or show a success message
        this.router.navigate(['/']);
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error;
        console.error('Error processing payment:', error);
      },
    );
  }
}
