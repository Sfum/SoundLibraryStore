import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {environment} from "../environments/environment";
import {RouterLink} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {AppRoutingModule} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';

import {CommonModule} from "@angular/common";

import {ProductCardComponent} from "./product-card/product-card.component";
import {ProductCardDetailComponent} from "./product-card/product-card-detail/product-card-detail.component";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {NavigationBarComponent} from "./shared/navigation-bar/navigation-bar.component";
import {LogoBarComponent} from "./shared/logo-bar/logo-bar.component";

import {HomeComponent} from "./home/home.component";
import {GenresComponent} from "./genres/genres.component";
import {BrandsComponent} from "./brands/brands.component";
import {BundlesComponent} from "./bundles/bundles.component";
import {FormatsComponent} from "./formats/formats.component";

import {ProductAddComponent} from "./product-add/product-add.component";
import {ProductEditComponent} from "./product-edit/product-edit.component";
import {ProductPageComponent} from "./product-page/product-page.component";

import {ProviderComponent} from "./provider/provider.component";
import {ShoppingCartComponent} from "./shopping-cart/shopping-cart.component";
import {WishlistComponent} from "./wishlist/wishlist.component";
import {BrandDetailComponent} from "./brands/brand-detail/brand-detail.component";
import {GenreDetailComponent} from "./genres/genre-detail/genre-detail.component";
import {MatCard} from "@angular/material/card";

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
    GenreDetailComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    RouterLink,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    MatButton,
    MatIcon,
    MatCard,

  ],
  providers: [
    provideAnimationsAsync()
  ],
  exports: [
    ProductCardComponent,
    BrandDetailComponent,
    NavigationBarComponent,
    LogoBarComponent
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
