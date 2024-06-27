import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Ticket } from '../models/ticket';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private ticketsCollection: AngularFirestoreCollection<Ticket>;

  constructor(private firestore: AngularFirestore) {
    this.ticketsCollection = this.firestore.collection<Ticket>('tickets');
  }

  // Method to create a ticket
  createTicket(ticket: Ticket): Promise<void> {
    return this.ticketsCollection.add(ticket).then(() => {});
  }

  // Method to fetch all tickets
  getAllTickets(): Observable<Ticket[]> {
    return this.ticketsCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Ticket;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }),
    );
  }

  // Method to update ticket status
  updateTicketStatus(
    ticketId: string,
    status: 'open' | 'pending' | 'completed',
  ): Promise<void> {
    return this.ticketsCollection.doc(ticketId).update({ status });
  }
}
