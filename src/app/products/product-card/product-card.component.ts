import { Component, Input, OnInit } from '@angular/core'; // Importing Angular core dependencies
import { Product } from '../../models/product'; // Importing the Product model
import { Observable, BehaviorSubject } from 'rxjs'; // Importing Observable and BehaviorSubject from RxJS
import { ProductService } from '../../services/product.service'; // Importing ProductService
import { WishlistService } from '../../services/wishlist.service'; // Importing WishlistService
import { CartService } from '../../services/cart.service'; // Importing CartService
import { map, switchMap } from 'rxjs/operators'; // Importing RxJS operators
import { Timestamp } from 'firebase/firestore'; // Importing Timestamp from Firebase

@Component({
  selector: 'app-product-card', // Defining the component's selector
  templateUrl: './product-card.component.html', // Defining the component's template URL
  styleUrls: ['./product-card.component.sass'], // Defining the component's styles
})
export class ProductCardComponent implements OnInit {
  // Declaring the ProductCardComponent class
  // @ts-ignore
  products$: Observable<Product[]>; // Observable to hold the list of products
  filteredProducts$ = new BehaviorSubject<Product[]>([]); // BehaviorSubject to hold the filtered products
  paginatedProducts: Product[] = []; // Array to hold the paginated products
  currentPage = 0; // Current page index
  itemsPerPage = 8; // Number of items per page
  searchQuery: string = ''; // Search query for filtering products

  @Input() products!: Product[]; // Input property for products array
  @Input() product!: Product; // Input property for a single product

  constructor(
    private productService: ProductService, // Injecting ProductService
    private wishlistService: WishlistService, // Injecting WishlistService
    private cartService: CartService, // Injecting CartService
  ) {}

  ngOnInit() {
    // Lifecycle hook for component initialization
    this.products$ = this.productService.productsArrayFiltered$; // Assigning products observable from ProductService
    this.products$.subscribe((products) => {
      // Subscribing to the products observable
      this.applyFilter(products); // Applying filter to products
    });
  }

  applyFilter(products: Product[]) {
    // Method to filter products based on search query
    let filtered = products.filter((product) => {
      return product.product_name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase()); // Filtering products by name
    });
    this.filteredProducts$.next(filtered); // Updating filteredProducts BehaviorSubject
    this.paginate(filtered); // Paginating the filtered products
  }

  filterProducts(products: Product[]) {
    // Wrapper method for applyFilter
    this.applyFilter(products);
  }

  sortByPrice(order: 'asc' | 'desc') {
    // Method to sort products by price
    this.filteredProducts$
      .pipe(
        map((products) =>
          products.sort((a, b) => {
            if (order === 'asc') {
              // @ts-ignore
              return a.price - b.price && a.salePrice - b.salePrice; // Ascending order
            } else {
              // @ts-ignore
              return b.price - a.price && b.salePrice - a.salePrice; // Descending order
            }
          }),
        ),
      )
      .subscribe((sortedProducts) => {
        this.filteredProducts$.next([...sortedProducts]); // Updating filteredProducts BehaviorSubject
        this.paginate(sortedProducts); // Paginating the sorted products
      });
  }

  sortByDiscount(order: 'asc' | 'desc') {
    // Method to sort products by discount
    this.filteredProducts$
      .pipe(
        map((products) =>
          products.sort((a, b) => {
            if (order === 'desc') {
              return (b.discountPercentage || 0) - (a.discountPercentage || 0); // Descending order
            } else {
              return (a.discountPercentage || 0) - (b.discountPercentage || 0); // Ascending order
            }
          }),
        ),
      )
      .subscribe((sortedProducts) => {
        this.filteredProducts$.next([...sortedProducts]); // Updating filteredProducts BehaviorSubject
        this.paginate(sortedProducts); // Paginating the sorted products
      });
  }

  sortByPopularity() {
    // Method to sort products by popularity
    this.filteredProducts$
      .pipe(map((products) => products.sort((a, b) => b.quantity - a.quantity))) // Sorting products by quantity
      .subscribe((sortedProducts) => {
        this.filteredProducts$.next(sortedProducts); // Updating filteredProducts BehaviorSubject
        this.paginate(sortedProducts); // Paginating the sorted products
      });
  }

  onPageChange(event: any) {
    // Method to handle page changes
    this.currentPage = event.pageIndex; // Updating current page index
    this.filteredProducts$.subscribe((products) => {
      // Subscribing to filtered products
      this.paginate(products); // Paginating products for the new page
    });
  }

  paginate(products: Product[]) {
    // Method to paginate products
    const start = this.currentPage * this.itemsPerPage; // Calculating start index
    const end = start + this.itemsPerPage; // Calculating end index
    this.paginatedProducts = products.slice(start, end); // Slicing products array to get paginated products
  }

  onAddToWishlist(product: any) {
    // Method to add product to wishlist
    this.wishlistService.addToWishlist(product); // Calling addToWishlist method of WishlistService
  }

  onAddToCart(product: any) {
    // Method to add product to cart
    this.cartService.addToCart(product); // Calling addToCart method of CartService
  }

  sortByNewArrival(order: 'asc' | 'desc'): void {
    // Method to sort products by new arrivals
    this.paginatedProducts.sort((a, b) => {
      const dateA = this.getDate(a.date_created); // Getting date of product a
      const dateB = this.getDate(b.date_created); // Getting date of product b

      if (order === 'asc') {
        return dateB.getTime() - dateA.getTime(); // Ascending order
      } else {
        return dateA.getTime() - dateB.getTime(); // Descending order
      }
    });
  }

  private getDate(date?: Timestamp | Date): Date {
    // Method to convert Timestamp or Date to Date object
    if (date instanceof Timestamp) {
      return date.toDate(); // Converting Timestamp to Date
    } else if (date instanceof Date) {
      return date; // Returning Date object
    } else {
      return new Date(0); // Returning epoch if date is undefined
    }
  }
}
