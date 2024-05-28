import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, Observable, throwError } from 'rxjs';
import { Brand } from '../models/brand';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  brands$ = this.getBrands();

  constructor(
    private firestore: AngularFirestore,
    public snackbarService: SnackbarService,
  ) {}

  getBrands(): Observable<any[]> {
    return this.firestore.collection('brands').valueChanges();
  }
  getBrand(id: string): Observable<Brand | undefined> {
    const brandRef = this.firestore
      .collection('brands')
      .doc<Brand>(id.toString());

    return brandRef.valueChanges().pipe(
      catchError((error) => {
        console.error('Error getting brand: ', error);
        return throwError('Something went wrong while fetching the brand');
      }),
    );
  }

  addBrand(brand: Brand): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const randomId = this.generateRandomId(); // Generating random 6-digit number

      this.firestore
        .collection('brands')
        .add(brand)
        .then((ref) => {
          const brandId = String(randomId);
          brand._id = ref.id; // Assign Firebase unique identifier to _id
          brand.id = randomId; // Assign random 6-digit number to id
          this.firestore
            .collection('brands')
            .doc(ref.id)
            .update({ _id: ref.id, id: randomId })
            .then(() => {
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
          this.snackbarService.showSnackbar('Brand Added Successfully!');
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  generateRandomId(): number {
    // Generate a random 6-digit number
    return Math.floor(100000 + Math.random() * 900000);
  }

  updateBrand(brandId: string, brand: Brand): Observable<void> {
    return new Observable((observer) => {
      this.firestore
        .collection('brands')
        .doc(brandId)
        .update(brand)
        .then(() => {
          observer.next();
          observer.complete();
          this.snackbarService.showSnackbar('Brand Updated Successfully!');
        })
        .catch((error) => {
          observer.error('Something went wrong while updating the brand');
        });
    });
  }
}
