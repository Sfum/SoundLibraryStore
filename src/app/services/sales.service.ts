import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Sale } from '../models/sale';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  constructor(private firestore: AngularFirestore) {}

  logSale(sale: Sale): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.firestore
        .collection('sales')
        .add(sale)
        .then((ref) => {
          sale.id = +ref.id;
          this.firestore
            .collection('sales')
            .doc(ref.id)
            .update({ id: ref.id })
            .then(() => {
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // Fetch all sales
  getAllSales(): Observable<Sale[]> {
    return this.firestore.collection<Sale>('sales').valueChanges();
  }
  getSalesByUploader(uploaderId: string): Observable<Sale[]> {
    return this.firestore
      .collection<Sale>('sales', (ref) =>
        ref.where('uploaderId', '==', uploaderId),
      )
      .valueChanges();
  }
}
