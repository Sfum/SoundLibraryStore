import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  EMPTY,
  map,
  Observable,
  shareReplay,
  Subject,
  takeUntil,
  throwError,
} from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Product, ProductComment } from '../models/product';
import { GenreService } from './genre.service';
import { BrandService } from './brand.service';
import { Genre } from '../models/genre';
import { Brand } from '../models/brand';
import { SnackbarService } from './snackbar.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private firestore: AngularFirestore,
    private genreService: GenreService,
    private brandService: BrandService,
    public snackbarService: SnackbarService,
    public router: Router,
  ) {
    this.brandSelectedSubject.pipe(takeUntil(this.unsubscribe$)).subscribe();
    this.genreSelectedSubject.pipe(takeUntil(this.unsubscribe$)).subscribe();
  }

  private unsubscribe$: Subject<void> = new Subject<void>();

  getProducts(): Observable<any[]> {
    return this.firestore.collection('products').valueChanges();
  }

  getProduct(id: string): Observable<Product | undefined> {
    return this.firestore
      .collection<Product>('products', (ref) => ref.where('id', '==', id))
      .valueChanges({ id: 'id' })
      .pipe(
        map((products) => (products.length > 0 ? products[0] : undefined)),
        catchError((error) => {
          console.error('Error getting product: ', error);
          return throwError('Something went wrong while fetching the product');
        }),
      );
  }

  addProduct(product: Product): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (product.discountPercentage) {
        product.salePrice =
          product.price * (1 - product.discountPercentage / 100);
        product.onSale = true;
      } else {
        product.salePrice = product.price;
        product.onSale = false;
      }

      this.firestore
        .collection('products')
        .add(product)
        .then((ref) => {
          product.id = +ref.id;
          this.firestore
            .collection('products')
            .doc(ref.id)
            .update({ id: ref.id })
            .then(() => {
              resolve();
              this.snackbarService.showSnackbar(`Product added successfully.`);
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

  updateProduct(productId: string, product: Product): Observable<void> {
    return new Observable((observer) => {
      if (product.discountPercentage) {
        product.salePrice =
          product.price * (1 - product.discountPercentage / 100);
        product.onSale = true;
      } else {
        product.salePrice = product.price;
        product.onSale = false;
      }

      this.firestore
        .collection('products')
        .doc(productId)
        .update(product)
        .then(() => {
          observer.next();
          observer.complete();
          this.snackbarService.showSnackbar(`Product updated successfully.`);
        })
        .catch((error) => {
          console.error('Error updating product: ', error);
          observer.error('Something went wrong while updating the product');
        });
    });
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await this.firestore.collection('products').doc(id).delete();
      this.snackbarService.showSnackbar(`Product deleted successfully.`);
    } catch (error) {
      console.error('Error deleting product: ', error);
      throw 'Something went wrong while deleting the product';
    }
  }

  products$: Observable<Product[]> = this.getProducts();
  genres$: Observable<Genre[]> = this.genreService.getGenres();
  brands$: Observable<Brand[]> = this.brandService.getBrands();

  private products: Product[] = [];

  optionBrandSelected(selectedBrandId: number) {
    this.brandSelectedSubject.next(0);
    this.genreSelectedSubject.next(0);
    this.brandSelectedSubject.next(+selectedBrandId);
  }

  public brandSelectedSubject = new BehaviorSubject<number>(0);
  brandSelectedAction$ = this.brandSelectedSubject.asObservable();

  brandActionStream$ = combineLatest([
    this.products$,
    this.brandSelectedAction$,
  ]).pipe(
    map(([products, selectedBrandId]) =>
      products.filter((product) =>
        selectedBrandId ? product.brandId == selectedBrandId : true,
      ),
    ),
    catchError((err) => {
      return EMPTY;
    }),
  );

  optionGenreSelected(selectedGenreId: number) {
    this.brandSelectedSubject.next(0);
    this.genreSelectedSubject.next(0);
    this.genreSelectedSubject.next(+selectedGenreId);
  }

  public genreSelectedSubject = new BehaviorSubject<number>(0);
  genreSelectedAction$ = this.genreSelectedSubject.asObservable();

  genreActionStream$ = combineLatest([
    this.brandActionStream$,
    this.genreSelectedAction$,
  ]).pipe(
    map(([products, selectedGenreId]) =>
      products.filter((product) =>
        selectedGenreId ? product.genreId == selectedGenreId : true,
      ),
    ),
    catchError((err) => {
      return EMPTY;
    }),
  );

  private priceRangeSelectedSubject = new BehaviorSubject<{
    min: number;
    max: number;
  }>({
    min: 0,
    max: Infinity,
  });
  priceRangeSelectedAction$ = this.priceRangeSelectedSubject.asObservable();

  optionPriceRangeSelected(minPrice: number, maxPrice: number) {
    this.priceRangeSelectedSubject.next({ min: minPrice, max: maxPrice });
  }

  priceActionStream$ = combineLatest([
    this.genreActionStream$,
    this.priceRangeSelectedAction$,
  ]).pipe(
    map(([products, priceRange]) =>
      products.filter(
        (product) =>
          product.price >= priceRange.min && product.price <= priceRange.max,
      ),
    ),
    catchError((err) => {
      return EMPTY;
    }),
  );
  onSaleProducts$ = this.getOnSaleProducts().pipe(shareReplay(1));
  // Combining price-filtered products with additional information (brand and genre names)
  productsArrayFiltered$ = combineLatest([
    this.priceActionStream$,
    this.brands$,
    this.genres$,
  ]).pipe(
    map(([products, brands, genres]) =>
      products.map(
        (product) =>
          ({
            ...product,
            genreId: genres.find((c) => product.genreId === c.id)?.[
              'genre_name'
            ],
            brandId: brands.find((c) => product.brandId === c.id)?.[
              'brand_name'
            ],
          }) as unknown as Product,
      ),
    ),
    shareReplay(1),
  );

  productsArrayOnSale$ = combineLatest([
    this.onSaleProducts$,
    this.brands$,
    this.genres$,
  ]).pipe(
    map(([products, brands, genres]) =>
      products
        .map(
          (product) =>
            ({
              ...product,
              genreId: genres.find((c) => product.genreId === c.id)?.[
                'genre_name'
              ],
              brandId: brands.find((c) => product.brandId === c.id)?.[
                'brand_name'
              ],
            }) as unknown as Product,
        )
        .filter((product) => product.onSale),
    ),
    shareReplay(1),
  );

  getFilteredProductCollection() {
    return this.productsArrayFiltered$;
  }
  getProductsByBrand(brandId: number): Observable<Product[]> {
    return this.firestore
      .collection<Product>('products', (ref) =>
        ref.where('brandId', '==', brandId),
      )
      .valueChanges();
  }
  getProductsByGenre(genreId: number): Observable<Product[]> {
    return this.firestore
      .collection<Product>('products', (ref) =>
        ref.where('genreId', '==', genreId),
      )
      .valueChanges();
  }
  getOnSaleProducts(): Observable<Product[]> {
    return this.firestore
      .collection<Product>('products', (ref) => ref.where('onSale', '==', true))
      .valueChanges()
      .pipe(
        map((products) => products || []), // Ensure products is an array
        catchError((error) => {
          console.error('Error getting on sale products: ', error);
          return throwError(
            'Something went wrong while fetching the on sale products',
          );
        }),
      );
  }
  getProductsByUploader(uploaderId: string): Observable<Product[]> {
    return this.firestore
      .collection<Product>('products', (ref) =>
        ref.where('uploaderId', '==', uploaderId),
      )
      .valueChanges();
  }
  filteredProducts$ = new BehaviorSubject<Product[]>([]);

  updateProductQuantity(
    productId: string,
    quantitySold: number,
  ): Observable<void> {
    return new Observable((observer) => {
      this.getProduct(productId).subscribe((product) => {
        if (product) {
          const newQuantity = product.quantity - quantitySold;
          this.firestore
            .collection('products')
            .doc(productId)
            .update({ quantity: newQuantity })
            .then(() => {
              observer.next();
              observer.complete();
              this.snackbarService.showSnackbar(
                `Inventory updated successfully.`,
              );
            })
            .catch((error) => {
              console.error('Error updating inventory: ', error);
              observer.error(
                'Something went wrong while updating the inventory',
              );
            });
        } else {
          observer.error('Product not found');
        }
      });
    });
  }
  getProductsByIds(productIds: string[]): Observable<Product[]> {
    // Create an array to store observables of individual product queries
    const productQueries: Observable<Product | undefined>[] = [];

    // Iterate through each product ID and create an observable for each product query
    productIds.forEach((productId) => {
      // Push the observable query to the array
      productQueries.push(this.getProduct(productId));
    });

    // Combine all observables into a single observable using combineLatest
    return combineLatest(productQueries).pipe(
      // Filter out undefined values (products not found)
      map((products) => products.filter((product) => !!product) as Product[]),
    );
  }
  async addComment(productId: string, comment: ProductComment): Promise<void> {
    try {
      await this.firestore
        .collection('products')
        .doc(productId)
        .update({
          comments: firebase.firestore.FieldValue.arrayUnion(comment),
        });
      this.snackbarService.showSnackbar('Comment added successfully.');
    } catch (error) {
      console.error('Error adding comment: ', error);
      throw new Error('Something went wrong while adding the comment');
    }
  }

  getComments(productId: string): Observable<ProductComment[]> {
    return this.firestore
      .collection<Product>('products')
      .doc(productId)
      .valueChanges()
      .pipe(
        map((product) => (product?.comments as ProductComment[]) || []),
        catchError((error) => {
          console.error('Error getting comments: ', error);
          return throwError('Something went wrong while fetching comments');
        }),
      );
  }

  ngOnDestroy() {
    this.unsubscribe$.next(); // Emit a signal to unsubscribe
    this.unsubscribe$.complete(); // Complete the unsubscribe$ subject
  }
}
