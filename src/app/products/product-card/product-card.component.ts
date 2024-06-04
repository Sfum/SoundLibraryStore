import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { Observable } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.sass'],
})
export class ProductCardComponent implements OnInit {
  // @ts-ignore
  products$: Observable<Product[]>;
  // @ts-ignore
  filteredProducts$: Observable<Product[]>;
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
    this.filteredProducts$ = this.products$;
    this.filteredProducts$ = this.filteredProducts$.pipe(
      map((products) => this.filterProducts(products)),
    );
    this.filteredProducts$.subscribe((products) => {
      this.paginate(products);
    });
  }

  filterProducts(products: Product[]) {
    return products.filter((product) => {
      return product.product_name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
    });
  }

  sortByPrice(order: 'asc' | 'desc') {
    this.filteredProducts$ = this.filteredProducts$.pipe(
      map((products) =>
        products.sort((a, b) => {
          if (order === 'asc') {
            return a.price - b.price;
          } else {
            return b.price - a.price;
          }
        }),
      ),
    );
  }

  sortByPopularity() {
    this.filteredProducts$ = this.filteredProducts$.pipe(
      map((products) => products.sort((a, b) => b.quantity - a.quantity)),
    );
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
}
