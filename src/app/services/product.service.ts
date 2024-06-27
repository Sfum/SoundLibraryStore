import { Injectable } from '@angular/core'; // Importing Injectable decorator from Angular core
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
} from 'rxjs'; // Importing various RxJS functionalities for reactive programming
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importing AngularFirestore for Firestore operations
import { Product, ProductComment } from '../models/product'; // Importing Product and ProductComment models
import { GenreService } from './genre.service'; // Importing GenreService
import { BrandService } from './brand.service'; // Importing BrandService
import { Genre } from '../models/genre'; // Importing Genre model
import { Brand } from '../models/brand'; // Importing Brand model
import { SnackbarService } from './snackbar.service'; // Importing SnackbarService for user notifications
import { Router } from '@angular/router'; // Importing Router for navigation
import { AuthService } from './auth.service'; // Importing AuthService for authentication
import firebase from 'firebase/compat/app'; // Importing Firebase app
import 'firebase/compat/auth'; // Importing Firebase auth
import 'firebase/compat/firestore'; // Importing Firebase Firestore
import { firestore } from 'firebase-admin'; // Importing Firestore from Firebase Admin SDK
import DocumentSnapshot = firestore.DocumentSnapshot; // Importing DocumentSnapshot type from Firestore

@Injectable({
  providedIn: 'root', // Making the service available at the root level
})
export class ProductService {
  constructor(
    private firestore: AngularFirestore, // Injecting AngularFirestore
    private genreService: GenreService, // Injecting GenreService
    private brandService: BrandService, // Injecting BrandService
    public snackbarService: SnackbarService, // Injecting SnackbarService
    public router: Router, // Injecting Router
  ) {
    // Subscribing to subjects and managing unsubscription
    this.brandSelectedSubject.pipe(takeUntil(this.unsubscribe$)).subscribe();
    this.genreSelectedSubject.pipe(takeUntil(this.unsubscribe$)).subscribe();
  }

  private unsubscribe$: Subject<void> = new Subject<void>(); // Subject to manage unsubscription and avoid memory leaks

  // Method to get all products from Firestore
  getProducts(): Observable<any[]> {
    return this.firestore.collection('products').valueChanges();
  }

  // Method to get a specific product by ID from Firestore
  getProduct(id: string): Observable<Product | undefined> {
    return this.firestore
      .collection<Product>('products', (ref) => ref.where('id', '==', id))
      .valueChanges({ id: 'id' })
      .pipe(
        map((products) => (products.length > 0 ? products[0] : undefined)), // Mapping to the first product if it exists
        catchError((error) => {
          console.error('Error getting product: ', error); // Logging the error
          return throwError('Something went wrong while fetching the product'); // Throwing a user-friendly error message
        }),
      );
  }

  // Method to add a new product to Firestore
  addProduct(product: Product): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Calculating sale price if discount is present
      if (product.discountPercentage) {
        product.salePrice =
          product.price * (1 - product.discountPercentage / 100);
        product.onSale = true;
      } else {
        product.salePrice = product.price;
        product.onSale = false;
      }

      // Adding product to Firestore
      this.firestore
        .collection('products')
        .add(product)
        .then((ref) => {
          product.id = +ref.id;
          this.firestore
            .collection('products')
            .doc(ref.id)
            .update({ id: ref.id }) // Updating the product with the generated ID
            .then(() => {
              resolve(); // Resolving the promise on success
              this.snackbarService.showSnackbar(`Product added successfully.`); // Showing success notification
            })
            .catch((error) => {
              reject(error); // Rejecting the promise on error
            });
        })
        .catch((error) => {
          reject(error); // Rejecting the promise on error
        });
    });
  }

  // Method to update an existing product in Firestore
  updateProduct(productId: string, product: Product): Observable<void> {
    return new Observable((observer) => {
      // Calculating sale price if discount is present
      if (product.discountPercentage) {
        product.salePrice =
          product.price * (1 - product.discountPercentage / 100);
        product.onSale = true;
      } else {
        product.salePrice = product.price;
        product.onSale = false;
      }

      // Updating the product in Firestore
      this.firestore
        .collection('products')
        .doc(productId)
        .update(product)
        .then(() => {
          observer.next(); // Emitting next value
          observer.complete(); // Completing the observable
          this.snackbarService.showSnackbar(`Product updated successfully.`); // Showing success notification
        })
        .catch((error) => {
          console.error('Error updating product: ', error); // Logging the error
          observer.error('Something went wrong while updating the product'); // Emitting error value
        });
    });
  }

  // Method to delete a product from Firestore
  async deleteProduct(id: string): Promise<void> {
    try {
      await this.firestore.collection('products').doc(id).delete(); // Deleting the product
      this.snackbarService.showSnackbar(`Product deleted successfully.`); // Showing success notification
    } catch (error) {
      console.error('Error deleting product: ', error); // Logging the error
      throw 'Something went wrong while deleting the product'; // Throwing a user-friendly error message
    }
  }

  // Observable streams for products, genres, and brands
  products$: Observable<Product[]> = this.getProducts();
  genres$: Observable<Genre[]> = this.genreService.getGenres();
  brands$: Observable<Brand[]> = this.brandService.getBrands();

  private products: Product[] = []; // Local array to hold products

  // Method to handle brand selection
  optionBrandSelected(selectedBrandId: number) {
    this.brandSelectedSubject.next(0); // Resetting brand selection
    this.genreSelectedSubject.next(0); // Resetting genre selection
    this.brandSelectedSubject.next(selectedBrandId); // Setting selected brand ID
  }

  public brandSelectedSubject = new BehaviorSubject<number>(0); // Subject to hold selected brand ID
  brandSelectedAction$ = this.brandSelectedSubject.asObservable(); // Observable stream for brand selection

  // Stream to filter products based on selected brand
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
      return EMPTY; // Returning empty observable on error
    }),
  );

  // Method to handle genre selection
  optionGenreSelected(selectedGenreId: number) {
    this.brandSelectedSubject.next(0); // Resetting brand selection
    this.genreSelectedSubject.next(0); // Resetting genre selection
    this.genreSelectedSubject.next(+selectedGenreId); // Setting selected genre ID
  }

  public genreSelectedSubject = new BehaviorSubject<number>(0); // Subject to hold selected genre ID
  genreSelectedAction$ = this.genreSelectedSubject.asObservable(); // Observable stream for genre selection

  // Stream to filter products based on selected genre
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
      return EMPTY; // Returning empty observable on error
    }),
  );

  // Subject to hold selected price range
  private priceRangeSelectedSubject = new BehaviorSubject<{
    min: number;
    max: number;
  }>({
    min: 0,
    max: Infinity,
  });
  priceRangeSelectedAction$ = this.priceRangeSelectedSubject.asObservable(); // Observable stream for price range selection

  // Method to handle price range selection
  optionPriceRangeSelected(minPrice: number, maxPrice: number) {
    this.priceRangeSelectedSubject.next({ min: minPrice, max: maxPrice }); // Setting selected price range
  }

  // Stream to filter products based on selected price range
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
      return EMPTY; // Returning empty observable on error
    }),
  );

  onSaleProducts$ = this.getOnSaleProducts().pipe(shareReplay(1)); // Caching on-sale products observable

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
    shareReplay(1), // Caching the filtered products observable
  );

  // Combining on-sale products with additional information (brand and genre names)
  productsArrayOnSale$ = combineLatest([
    this.onSaleProducts$,
    this.brands$,
    this.genres$,
  ]).pipe(
    map(
      ([products, brands, genres]) =>
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
          .filter((product) => product.onSale), // Filtering only on-sale products
    ),
    shareReplay(1), // Caching the on-sale products observable
  );

  // Method to get the filtered product collection
  getFilteredProductCollection() {
    return this.productsArrayFiltered$;
  }

  // Method to get products by brand
  getProductsByBrand(brandId: number): Observable<Product[]> {
    return this.firestore
      .collection<Product>('products', (ref) =>
        ref.where('brandId', '==', brandId),
      )
      .valueChanges();
  }

  // Method to get products by genre
  getProductsByGenre(genreId: number): Observable<Product[]> {
    return this.firestore
      .collection<Product>('products', (ref) =>
        ref.where('genreId', '==', genreId),
      )
      .valueChanges();
  }

  // Method to get on-sale products
  getOnSaleProducts(): Observable<Product[]> {
    return this.firestore
      .collection<Product>('products', (ref) => ref.where('onSale', '==', true))
      .valueChanges()
      .pipe(
        map((products) => products || []), // Ensuring products is an array
        catchError((error) => {
          console.error('Error getting on sale products: ', error); // Logging the error
          return throwError(
            'Something went wrong while fetching the on sale products',
          ); // Throwing a user-friendly error message
        }),
      );
  }

  // Method to get products by uploader
  getProductsByUploader(uploaderId: string): Observable<Product[]> {
    return this.firestore
      .collection<Product>('products', (ref) =>
        ref.where('uploaderId', '==', uploaderId),
      )
      .valueChanges();
  }

  filteredProducts$ = new BehaviorSubject<Product[]>([]); // Subject to hold filtered products

  // Method to update product quantity
  updateProductQuantity(
    productId: string,
    quantitySold: number,
  ): Observable<void> {
    return new Observable((observer) => {
      this.getProduct(productId).subscribe((product) => {
        if (product) {
          const newQuantity = product.quantity - quantitySold; // Calculating new quantity
          this.firestore
            .collection('products')
            .doc(productId)
            .update({ quantity: newQuantity }) // Updating product quantity
            .then(() => {
              observer.next(); // Emitting next value
              observer.complete(); // Completing the observable
              this.snackbarService.showSnackbar(
                `Inventory updated successfully.`,
              ); // Showing success notification
            })
            .catch((error) => {
              console.error('Error updating inventory: ', error); // Logging the error
              observer.error(
                'Something went wrong while updating the inventory',
              ); // Emitting error value
            });
        } else {
          observer.error('Product not found'); // Emitting error if product not found
        }
      });
    });
  }

  // Method to get a product snapshot
  getProductSnapShot(
    id: string,
  ): Observable<firebase.firestore.DocumentSnapshot<Product>> {
    return this.firestore.collection<Product>('products').doc(id).get();
  }

  // Method to add a comment to a product
  async addComment(productId: string, comment: ProductComment): Promise<void> {
    try {
      await this.firestore
        .collection('products')
        .doc(productId)
        .update({
          comments: firebase.firestore.FieldValue.arrayUnion(comment),
        }); // Adding the comment to the product
      console.log('Comment added successfully.');
    } catch (error) {
      console.error('Error adding comment: ', error); // Logging the error
      throw new Error('Something went wrong while adding the comment'); // Throwing a user-friendly error message
    }
  }

  // Method to get comments for a product
  getComments(productId: string): Observable<ProductComment[]> {
    return this.firestore
      .collection<Product>('products')
      .doc(productId)
      .valueChanges()
      .pipe(
        map((product) => (product?.comments as ProductComment[]) || []), // Ensuring comments is an array
        catchError((error) => {
          console.error('Error getting comments: ', error); // Logging the error
          return throwError('Something went wrong while fetching comments'); // Throwing a user-friendly error message
        }),
      );
  }

  // Method to handle component destruction and cleanup
  ngOnDestroy() {
    this.unsubscribe$.next(); // Emitting next value to trigger unsubscription
    this.unsubscribe$.complete(); // Completing the subject
  }
}
