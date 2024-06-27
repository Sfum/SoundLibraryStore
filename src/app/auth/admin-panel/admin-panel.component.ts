import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { TicketService } from '../../services/ticket.service';
import { User } from '../../models/user';
import { Product } from '../../models/product';
import { Ticket } from '../../models/ticket';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.sass'],
})
export class AdminPanelComponent implements OnInit {
  users$: Observable<User[]>;
  products$: Observable<Product[]>;
  tickets$: Observable<Ticket[]> | undefined;

  private pageSize = 10; // Number of tickets per page
  private lastTicket?: Ticket; // Reference to the last fetched ticket for pagination

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private ticketService: TicketService,
  ) {
    // @ts-ignore
    this.users$ = this.authService.getAllUsers();
    this.products$ = this.productService.getProducts();
    this.loadTickets(); // Initial loading of tickets
  }

  ngOnInit(): void {}

  updateTicketStatus(
    ticketId: string,
    status: 'open' | 'pending' | 'completed',
  ) {
    if (!ticketId) {
      console.error('Ticket ID is undefined');
      return;
    }

    this.ticketService.updateTicketStatus(ticketId, status).catch((error) => {
      console.error('Error updating ticket status:', error);
    });
  }

  loadTickets() {
    this.tickets$ = this.ticketService.getAllTickets(this.pageSize); // Initial load
  }

  loadMoreTickets() {
    this.ticketService
      .getAllTickets(this.pageSize, this.lastTicket)
      .subscribe((tickets) => {
        if (tickets.length > 0) {
          this.lastTicket = tickets[tickets.length - 1];
          // Update tickets$ with the new data
          this.tickets$ = new BehaviorSubject<Ticket[]>(tickets);
        }
      });
  }
}
