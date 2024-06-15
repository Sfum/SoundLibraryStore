import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { Observable, BehaviorSubject } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { map, switchMap } from 'rxjs/operators';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.sass'],
})
export class ProductCardComponent implements OnInit {
  // @ts-ignore
  products$: Observable<Product[]>;
  filteredProducts$ = new BehaviorSubject<Product[]>([]);
  paginatedProducts: Product[] = [];
  currentPage = 0;
  itemsPerPage = 8;
  searchQuery: string = '';

  @Input() products!: Product[];
  @Input() product!: Product;

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.products$ = this.productService.productsArrayFiltered$;
    this.products$.subscribe((products) => {
      this.applyFilter(products);
    });
  }

  applyFilter(products: Product[]) {
    let filtered = products.filter((product) => {
      return product.product_name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
    });
    this.filteredProducts$.next(filtered);
    this.paginate(filtered);
  }

  filterProducts(products: Product[]) {
    this.applyFilter(products);
  }

  sortByPrice(order: 'asc' | 'desc') {
    this.filteredProducts$
      .pipe(
        map((products) =>
          products.sort((a, b) => {
            if (order === 'asc') {
              // @ts-ignore
              return a.price - b.price && a.salePrice - b.salePrice;
            } else {
              // @ts-ignore
              return b.price - a.price && b.salePrice - a.salePrice;
            }
          }),
        ),
      )
      .subscribe((sortedProducts) => {
        this.filteredProducts$.next([...sortedProducts]); // Spread operator to create a new array
        this.paginate(sortedProducts);
      });
  }

  sortByDiscount(order: 'asc' | 'desc') {
    this.filteredProducts$
      .pipe(
        map((products) =>
          products.sort((a, b) => {
            if (order === 'desc') {
              return (b.discountPercentage || 0) - (a.discountPercentage || 0);
            } else {
              return (a.discountPercentage || 0) - (b.discountPercentage || 0);
            }
          }),
        ),
      )
      .subscribe((sortedProducts) => {
        this.filteredProducts$.next([...sortedProducts]); // Spread operator to create a new array
        this.paginate(sortedProducts);
      });
  }

  sortByPopularity() {
    this.filteredProducts$
      .pipe(map((products) => products.sort((a, b) => b.quantity - a.quantity)))
      .subscribe((sortedProducts) => {
        this.filteredProducts$.next(sortedProducts);
        this.paginate(sortedProducts);
      });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.filteredProducts$.subscribe((products) => {
      this.paginate(products);
    });
  }

  paginate(products: Product[]) {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = products.slice(start, end);
  }

  onAddToWishlist(product: any) {
    this.wishlistService.addToWishlist(product);
  }

  onAddToCart(product: any) {
    this.cartService.addToCart(product);
  }
  sortByNewArrival(order: 'asc' | 'desc'): void {
    this.paginatedProducts.sort((a, b) => {
      const dateA = this.getDate(a.date_created);
      const dateB = this.getDate(b.date_created);

      if (order === 'asc') {
        return dateB.getTime() - dateA.getTime();
      } else {
        return dateA.getTime() - dateB.getTime();
      }
    });
  }

  private getDate(date?: Timestamp | Date): Date {
    if (date instanceof Timestamp) {
      return date.toDate();
    } else if (date instanceof Date) {
      return date;
    } else {
      return new Date(0); // Fallback to epoch if date is undefined
    }
  }
}
