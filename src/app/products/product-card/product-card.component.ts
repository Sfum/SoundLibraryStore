import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { Observable } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { BrandService } from '../../services/brand.service';
import { GenreService } from '../../services/genre.service';
import { Brand } from '../../models/brand';
import { Genre } from '../../models/genre';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.sass',
})
export class ProductCardComponent implements OnInit {
  @Input() products!: Product[];
  @Input() product!: Product;
  productCollection$!: Observable<Product[]>;
  brandCollection$!: Observable<Brand[]>;
  genreCollection$!: Observable<Genre[]>;

  constructor(
    private productService: ProductService,
    private brandService: BrandService,
    private genreService: GenreService,
    private wishlistService: WishlistService,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.productCollection$ = this.productService.productsArrayFiltered$;
    this.brandCollection$ = this.brandService.brands$;
    this.genreCollection$ = this.genreService.genres$;
  }
  onAddToWishlist(product: any) {
    this.wishlistService.addToWishlist(product);
  }

  onAddToCart(product: any) {
    this.cartService.addToCart(product);
  }
}
