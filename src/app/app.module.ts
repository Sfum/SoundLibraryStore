import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductCarouselComponent } from './products/product-carousel/product-carousel.component';
import { StorageComponent } from './storage/storage.component';
// @ts-ignore

import { AppRoutingModule } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AngularFireModule } from '@angular/fire/compat';

import {
  AngularFireAuthModule,
  USE_EMULATOR as USE_AUTH_EMULATOR,
} from '@angular/fire/compat/auth';
import {
  AngularFirestoreModule,
  USE_EMULATOR as USE_FIRESTORE_EMULATOR,
} from '@angular/fire/compat/firestore';

import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { CommonModule } from '@angular/common';

import { ProductCardComponent } from './products/product-card/product-card.component';
import { ProductCardDetailComponent } from './products/product-card/product-card-detail/product-card-detail.component';
import {
  MatButton,
  MatFabButton,
  MatMiniFabButton,
} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NavigationBarComponent } from './shared/navigation-bar/navigation-bar.component';
import { LogoBarComponent } from './shared/logo-bar/logo-bar.component';

import { HomeComponent } from './home/home.component';
import { GenresComponent } from './genres/genres.component';
import { BrandsComponent } from './brands/brands.component';
import { BundlesComponent } from './bundles/bundles.component';
import { FormatsComponent } from './formats/formats.component';

import { ProductAddComponent } from './products/product-add/product-add.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { ProductPageComponent } from './products/product-page/product-page.component';

import { ProviderComponent } from './provider/provider.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { BrandDetailComponent } from './brands/brand-detail/brand-detail.component';
import { GenreDetailComponent } from './genres/genre-detail/genre-detail.component';
import { MatCard } from '@angular/material/card';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { BundleDetailComponent } from './bundles/bundle-detail/bundle-detail.component';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LogoutComponent } from './auth/logout/logout.component';

import { MatDialogModule } from '@angular/material/dialog';
import { ProductListComponent } from './products/product-list/product-list.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { ProductFilterComponent } from './products/product-filter/product-filter.component';
import { ProductFilterDetailComponent } from './products/product-filter/product-filter-detail/product-filter-detail.component';
import { ProductPageDetailComponent } from './products/product-page/product-page-detail/product-page-detail.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { BrandListComponent } from './brands/brand-list/brand-list.component';
import { GenreEditComponent } from './genres/genre-edit/genre-edit.component';
import { BrandAddComponent } from './brands/brand-add/brand-add.component';
import { GenreAddComponent } from './genres/genre-add/genre-add.component';
import { BrandEditComponent } from './brands/brand-edit/brand-edit.component';
import { GenreListComponent } from './genres/genre-list/genre-list.component';

import { ProductRelatedComponent } from './products/product-related/product-related.component';

import { WishlistDetailComponent } from './wishlist/wishlist-detail/wishlist-detail.component';

import { PriceFilterComponent } from './products/product-filter/price-filter/price-filter.component';
import { ShoppingCartDetailComponent } from './shopping-cart/shopping-cart-detail/shopping-cart-detail.component';
import { MatBadge } from '@angular/material/badge';
import { ProfileComponent } from './auth/profile/profile.component';
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperNext,
  MatStepperPrevious,
} from '@angular/material/stepper';
import { MatSlider } from '@angular/material/slider';
import { ProductGridComponent } from './products/product-grid/product-grid.component';
import { OnSaleComponent } from './on-sale/on-sale.component';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OnSaleDetailComponent } from './on-sale/on-sale-detail/on-sale-detail.component';
import { ShoppingCartPaymentComponent } from './shopping-cart/shopping-cart-payment/shopping-cart-payment.component';
import { OnSaleBrandComponent } from './on-sale/on-sale-brand/on-sale-brand.component';
import { OnSaleGenreComponent } from './on-sale/on-sale-genre/on-sale-genre.component';
import { PaymentComponent } from './shopping-cart/payment/payment.component';
import { ProductListModeratorsComponent } from './products/product-list-moderators/product-list-moderators.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductCardComponent,
    ProductCardDetailComponent,
    BrandDetailComponent,
    HomeComponent,
    NavigationBarComponent,
    LogoBarComponent,
    BrandsComponent,
    GenresComponent,
    BundlesComponent,
    FormatsComponent,
    ProductAddComponent,
    ProductEditComponent,
    ProductPageComponent,
    ProviderComponent,
    ShoppingCartComponent,
    BrandDetailComponent,
    WishlistComponent,
    GenreDetailComponent,
    BundleDetailComponent,
    LoginComponent,
    SignupComponent,
    LogoutComponent,
    ProductListComponent,
    ProductFilterComponent,
    ProductFilterDetailComponent,
    ProductPageDetailComponent,
    BrandAddComponent,
    GenreAddComponent,
    BrandEditComponent,
    GenreListComponent,
    BrandListComponent,
    GenreListComponent,
    GenreEditComponent,
    ProductRelatedComponent,
    WishlistDetailComponent,
    ProductCarouselComponent,
    ShoppingCartDetailComponent,
    ProfileComponent,
    StorageComponent,
    PriceFilterComponent,
    ProductGridComponent,
    OnSaleComponent,
    OnSaleDetailComponent,
    ShoppingCartPaymentComponent,
    OnSaleBrandComponent,
    OnSaleGenreComponent,
    PaymentComponent,
    ProductListModeratorsComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    RouterLink,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    MatButton,
    MatIcon,
    MatCard,
    MatLabel,
    MatFormField,
    MatSelect,
    MatInput,
    MatOption,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatDialogModule,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatPaginator,
    MatRow,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatSlideToggle,
    MatMiniFabButton,
    MatFabButton,
    MatBadge,
    MatStep,
    MatStepperPrevious,
    MatStepperNext,
    MatStepper,
    MatStepLabel,
    MatSlider,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSuffix,
  ],
  providers: [
    provideAnimationsAsync(),
    {
      provide: USE_AUTH_EMULATOR,
      useValue: environment.useEmulators ? ['localhost', 9099] : undefined,
    },
    {
      provide: USE_FIRESTORE_EMULATOR,
      useValue: environment.useEmulators ? ['localhost', 8080] : undefined,
    },
    // { provide: USE_FUNCTIONS_EMULATOR, useValue: environment.useEmulators ? ['localhost', 5001] : undefined },
  ],
  exports: [
    ProductCardComponent,
    BrandDetailComponent,
    NavigationBarComponent,
    LogoBarComponent,
    BrandListComponent,
    ProductFilterComponent,
    ProductGridComponent,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
