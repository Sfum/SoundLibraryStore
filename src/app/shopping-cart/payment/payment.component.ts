import { Component, OnInit } from '@angular/core';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.sass'],
})
export class PaymentComponent implements OnInit {
  loading = false;
  errorMessage = '';
  cardElement: any;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'auto',
  };

  constructor(private stripeService: StripeService) {}

  async ngOnInit() {
    const stripe = this.stripeService.getStripe();
    // @ts-ignore
    const elements = stripe.elements();
    this.cardElement = elements.create('card', this.cardOptions);
    this.cardElement.mount('#card-element');
  }

  async handlePayment(event: Event) {
    event.preventDefault();
    this.loading = true;

    const stripe = this.stripeService.getStripe();
    const { clientSecret } = await this.stripeService.createPaymentIntent(
      5000,
      'usd',
    ); // example amount in cents

    // @ts-ignore
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: this.cardElement,
        },
      },
    );

    if (error) {
      // @ts-ignore
      this.errorMessage = error.message;
      this.loading = false;
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Handle successful payment here
      alert('Payment successful!');
      this.loading = false;
    }
  }
}
