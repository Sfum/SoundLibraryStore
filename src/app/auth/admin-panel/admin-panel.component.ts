import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { TicketService } from '../../services/ticket.service';
import { User } from '../../models/user';
import { Product } from '../../models/product';
import { Ticket } from '../../models/ticket';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.sass'],
})
export class AdminPanelComponent implements OnInit {
  users$: Observable<User[]>;
  products$: Observable<Product[]>;
  tickets$: Observable<Ticket[]>;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private ticketService: TicketService,
    private snackBar: MatSnackBar,
  ) {
    // @ts-ignore
    this.users$ = this.authService.getAllUsers();
    this.products$ = this.productService.getProducts();
    this.tickets$ = this.ticketService.getAllTickets();
  }

  ngOnInit(): void {}

  updateTicketStatus(
    ticketId: string,
    status: 'open' | 'pending' | 'completed',
    ticket?: Ticket,
  ) {
    if (!ticketId) {
      console.error('Ticket ID is undefined');
      return;
    }

    if (status === 'pending' && ticket) {
      this.ticketService
        .updateTicketStatus(ticketId, status)
        .then(() => {
          this.openGmailCompose(
            ticket.email,
            ticket.productId,
            ticket.id,
            ticket.subject,
            ticket.message,
          );
        })
        .catch((error) => {
          console.error('Error updating ticket status:', error);
        });
    } else if (status === 'completed') {
      this.snackBar
        .open(
          'Are you sure you want to mark this ticket as completed?',
          'Confirm',
          {
            duration: 5000,
          },
        )
        .onAction()
        .subscribe(() => {
          this.completeTicketStatus(ticketId, status);
        });
    } else if (status === 'open' && ticket?.status !== 'open') {
      this.snackBar
        .open(
          'Are you sure you want to revert the ticket status to open?',
          'Confirm',
          {
            duration: 5000,
          },
        )
        .onAction()
        .subscribe(() => {
          this.completeTicketStatus(ticketId, status);
        });
    } else {
      this.completeTicketStatus(ticketId, status);
    }
  }

  completeTicketStatus(
    ticketId: string,
    status: 'open' | 'pending' | 'completed',
  ) {
    this.ticketService.updateTicketStatus(ticketId, status).catch((error) => {
      console.error('Error updating ticket status:', error);
    });
  }

  openGmailCompose(
    email: string | undefined,
    productId: string | undefined,
    ticketId: string | undefined,
    subject: string | undefined,
    message: string | undefined,
  ): void {
    if (!ticketId) {
      console.error('Ticket ID is undefined');
      return;
    }

    const recipientEmail = email || '';
    const emailSubject = `${productId || ''}; ${ticketId || ''}: ${subject || ''}`;
    const emailBody = `Hello, and thank you for contacting us!\n\n\n\n\n\nKindest Regards,\n\nCustomer Support\n\n__________________\n\nTicket ID: ${ticketId}\n\nYou wrote to support:\n${message || ''}\n\n`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(gmailUrl, '_blank');
  }

  isOpenDisabled(ticket: Ticket): boolean {
    return ticket.status === 'open';
  }
}
