import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Ticket } from '../models/ticket';
import { Observable } from 'rxjs';
// @ts-ignore
import { map, startAfter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(private firestore: AngularFirestore) {}

  // Method to create a ticket
  createTicket(ticket: Ticket): Promise<void> {
    return this.firestore
      .collection('tickets')
      .add(ticket)
      .then(() => {});
  }

  // Method to fetch tickets with pagination
  getAllTickets(pageSize: number, startAfter?: Ticket): Observable<Ticket[]> {
    let query = this.firestore
      .collection<Ticket>('tickets', (ref) => {
        let baseQuery = ref.orderBy('created_at', 'desc').limit(pageSize);
        if (startAfter) {
          baseQuery = baseQuery.startAfter(startAfter.created_at);
        }
        return baseQuery;
      })
      .valueChanges();

    return query.pipe(map((tickets) => tickets.reverse()));
  }

  // Method to update ticket status
  updateTicketStatus(
    ticketId: string,
    status: 'open' | 'pending' | 'completed',
  ): Promise<void> {
    return this.firestore
      .collection('tickets')
      .doc(ticketId)
      .update({ status });
  }
}
