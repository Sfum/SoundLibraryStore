// main.ts

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module'; // Import AppModule
import { AppComponent } from './app/app.component'; // Import AppComponent

// Bootstrap AppModule with AppComponent
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
