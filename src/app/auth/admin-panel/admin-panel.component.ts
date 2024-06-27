// admin-panel.component.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { TicketService } from '../../services/ticket.service';
import { User } from '../../models/user';
import { Product } from '../../models/product';
import { Ticket } from '../../models/ticket';
import { Observable } from 'rxjs';

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
  ) {
    if (!ticketId) {
      console.error('Ticket ID is undefined');
      return;
    }

    this.ticketService.updateTicketStatus(ticketId, status).catch((error) => {
      console.error('Error updating ticket status:', error);
    });
  }
}
