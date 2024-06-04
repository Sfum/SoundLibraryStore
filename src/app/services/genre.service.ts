import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, Observable, throwError } from 'rxjs';
import { Genre } from '../models/genre';
import { Brand } from '../models/brand';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  genres$ = this.getGenres();

  constructor(
    private firestore: AngularFirestore,
    private snackbarService: SnackbarService,
  ) {}

  getGenres(): Observable<any[]> {
    return this.firestore.collection('genres').valueChanges();
  }

  getGenre(id: string): Observable<Genre | undefined> {
    const genreRef = this.firestore
      .collection('genres')
      .doc<Genre>(id.toString());

    return genreRef.valueChanges().pipe(
      catchError((error) => {
        console.error('Error getting genre: ', error);
        return throwError('Something went wrong while fetching the genre');
      }),
    );
  }

  addGenre(genre: Genre): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.firestore
        .collection('genres')
        .add(genre)
        .then((ref) => {
          genre._id = String(+ref.id);
          this.firestore
            .collection('genres')
            .doc(ref.id)
            .update({ _id: ref.id })
            .then(() => {
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
          this.snackbarService.showSnackbar('Genre Added Successfully!');
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  updateGenre(genreId: string, genre: Genre): Observable<void> {
    return new Observable((observer) => {
      this.firestore
        .collection('genres')
        .doc(genreId)
        .update(genre)
        .then(() => {
          observer.next();
          observer.complete();
          this.snackbarService.showSnackbar('Genre Updated Successfully!');
        })
        .catch((error) => {
          observer.error('Something went wrong while updating the genre');
        });
    });
  }
}
