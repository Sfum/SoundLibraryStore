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

@NgModule({
  declarations: [
    AppComponent,
    ProductCardComponent,
    ProductCardDetailComponent

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

  ],
  providers: [
    provideAnimationsAsync()
  ],
  exports: [
    ProductCardComponent
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
