// product-ticket.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { Ticket } from '../../models/ticket';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { Timestamp } from 'firebase/firestore';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-product-ticket',
  templateUrl: './product-ticket.component.html',
  styleUrls: ['./product-ticket.component.sass'],
})
export class ProductTicketComponent implements OnInit {
  @Input() productId!: string;
  ticketForm: FormGroup;
  currentUser$: Observable<User | null>;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private authService: AuthService,
    private snackbarService: SnackbarService,
  ) {
    this.ticketForm = this.fb.group({
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
    // @ts-ignore
    this.currentUser$ = this.authService.user$;
  }

  ngOnInit(): void {}

  submitTicket() {
    if (this.ticketForm.valid) {
      this.currentUser$.subscribe((currentUser) => {
        if (currentUser) {
          const ticket: Ticket = {
            userId: currentUser.uid,
            // @ts-ignore
            email: currentUser.email,
            productId: this.productId,
            subject: this.ticketForm.get('subject')?.value,
            message: this.ticketForm.get('message')?.value,
            status: 'open', // Set the status to 'open' when creating a new ticket
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
          };

          this.ticketService
            .createTicket(ticket)
            .then(() => {
              this.ticketForm.reset();
              this.snackbarService.showSnackbar(
                'Ticket created successfully! We will be in touch shortly!',
              );
            })
            .catch((error) => {
              console.error('Error creating ticket: ', error);
              this.snackbarService.showSnackbar('Error creating ticket!');
            });
        } else {
          console.error('No user is currently logged in');
          // Optionally show an error message to the user
        }
      });
    }
  }
}
