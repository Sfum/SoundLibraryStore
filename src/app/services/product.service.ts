import {Injectable} from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  EMPTY,
  map,
  Observable,
  shareReplay, Subject,
  takeUntil,
  throwError
} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Product} from "../models/product";
import {GenreService} from "./genre.service";
import {BrandService} from "./brand.service";
import {Genre} from "../models/genre";
import {Brand} from "../models/brand";
import {SnackbarService} from "./snackbar.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: AngularFirestore,
              private genreService: GenreService,
              private brandService: BrandService,
              public snackbarService: SnackbarService,
              public router: Router) {
    this.brandSelectedSubject.pipe(takeUntil(this.unsubscribe$)).subscribe();
    this.genreSelectedSubject.pipe(takeUntil(this.unsubscribe$)).subscribe();
  }

  private unsubscribe$: Subject<void> = new Subject<void>();


  getProducts(): Observable<any[]> {
    return this.firestore.collection('products',).valueChanges();
  }

  getProduct(id: string): Observable<Product | undefined> {
    const productRef = this.firestore.collection('products').doc<Product>(id.toString());

    return productRef.valueChanges().pipe(
      catchError((error) => {
        console.error('Error getting product: ', error);
        return throwError('Something went wrong while fetching the product');
      })
    );
  }

  addProduct(product: Product): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.firestore.collection('products')
      .add(product)
      .then(ref => {
        product.id = +ref.id;
        this.firestore.collection('products')
        .doc(ref.id).update({id: ref.id})
        .then(() => {
          resolve()
          this.snackbarService.showSnackbar(`Product Added successfully.`);

        }).catch(error => {
          reject(error);
        });
      }).catch(error => {
        reject(error);
      });
    });
  }

  updateProduct(productId: string, product: Product): Observable<void> {
    return new Observable((observer) => {
      this.firestore.collection('products').doc(productId).update(product)
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

  deleteProduct(id: string): Promise<void> {
    return this.firestore.collection('products').doc(id).delete()
    .then(() => {
      this.snackbarService.showSnackbar(`Product deleted successfully.`);
    })
    .catch((error) => {
      console.error('Error deleting product: ', error);
      return Promise.reject('Something went wrong while deleting the product');
    });
  }

  // Observable for retrieving products from the mock API
  products$: Observable<Product[]> = this.getProducts()
  // Observables for genre and brand data from their respective services
  genres$: Observable<Genre[]> = this.genreService.getGenres()
  brands$: Observable<Brand[]> = this.brandService.getBrands()

  // Private variables for product data and filtered product subject
  private products: Product[] = [];

  private productsFilteredSubject = new BehaviorSubject<Product[]>(this.products);
  productsFiltered$ = this.productsFilteredSubject.asObservable();

  // Method to handle selecting a brand
  optionBrandSelected(selectedBrandId: number) {
    this.brandSelectedSubject.next(0);
    this.genreSelectedSubject.next(0);
    this.brandSelectedSubject.next(+selectedBrandId);
  }

  // Subject and Observable for selected brand
  public brandSelectedSubject = new BehaviorSubject<number>(0);
  brandSelectedAction$ = this.brandSelectedSubject.asObservable();

  // Combining products and selected brand to filter products by brand
  brandActionStream$ = combineLatest([
    this.products$,
    this.brandSelectedAction$,
  ]).pipe(
    map(([products, selectedBrandId]) =>
      products.filter((product) =>
        selectedBrandId ? product.brandId == selectedBrandId : true
      )
    ),
    catchError((err) => {
      return EMPTY;
    })
  );

  // Method to handle changing the selected genre
  optionGenreSelected(selectedGenreId: number) {
    this.brandSelectedSubject.next(0);
    this.genreSelectedSubject.next(0);
    this.genreSelectedSubject.next(+selectedGenreId);

  }

  // Subject and Observable for selected genre
  public genreSelectedSubject = new BehaviorSubject<number>(0);
  genreSelectedAction$ = this.genreSelectedSubject.asObservable();

  // Combining brand-filtered products and selected genre to filter products by genre
  genreActionStream$ = combineLatest([
    this.brandActionStream$,
    this.genreSelectedAction$,
  ]).pipe(
    map(([products, selectedGenreId]) =>
      products.filter((product) =>
        selectedGenreId ? product.genreId == selectedGenreId : true
      )
    ),
    catchError((err) => {
      return EMPTY;
    })
  );

  // Combining genre-filtered products with additional information (brand and genre names)
  productsArrayFiltered$ = combineLatest([
    this.genreActionStream$,
    this.brands$,
    this.genres$,
  ]).pipe(
    map(([products, brands, genres]) =>
      products.map(
        (product) =>
          ({
            ...product,
            genreId: genres.find((c) => product.genreId === c.id)?.['genre_name'],
            brandId: brands.find((c) => product.brandId === c.id)?.['brand_name'],
          } as unknown as Product)
      )
    ),
    shareReplay(1)
  );

  // Combining filtered products with brands and genres
  filteredProducts$ = combineLatest([
    this.productsArrayFiltered$,
    this.brands$,
    this.genres$,
  ]).pipe(
    map(([products, brands, genres]) => ({
      products,
      brands,
      genres,
    }))
  );

  getFilteredProductCollection() {
    return this.productsArrayFiltered$
  }

  getRelatedProducts(genreId: number): Observable<Product[]> {
    return this.firestore.collection<Product>('products', ref =>
      ref.where('genreId', '==', genreId)
    ).valueChanges();
  }

  getSameBrandProducts(brandId: number): Observable<Product[]> {
    return this.firestore.collection<Product>('brands', ref =>
      ref.where('brandId', '==', brandId)
    ).valueChanges();
  }

  ngOnDestroy() {
    this.unsubscribe$.next(); // Emit a signal to unsubscribe
    this.unsubscribe$.complete(); // Complete the unsubscribe$ subject
  }


}
