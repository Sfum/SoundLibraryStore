import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";
import {ICreateOrderRequest, IPayPalConfig, NgxPayPalModule} from "ngx-paypal";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-shopping-cart-payment',
  standalone: true,
  imports: [
    NgxPayPalModule,
    DecimalPipe
  ],
  templateUrl: './shopping-cart-payment.component.html',
  styleUrl: './shopping-cart-payment.component.sass'
})
export class ShoppingCartPaymentComponent  implements OnInit {
  public payPalConfig?: IPayPalConfig;
  showSuccess!: any;
  cartTotal!: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.initConfig();
    this.cartTotal =
      JSON.parse(localStorage.getItem('cart_items') as any) || [];
    console.log(this.cartTotal);
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: `${environment.firebase}`,
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'EUR',
                value: `${this.cartTotal}`,
                breakdown: {
                  item_total: {
                    currency_code: 'EUR',
                    value: `${this.cartTotal}`,
                  },
                },
              },
              items: [
                {
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'EUR',
                    value: `${this.cartTotal}`,
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details: any) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );
        if (data.status === 'COMPLETED') {
          this.router.navigate(['/success']);
        }
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
