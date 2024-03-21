import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from "./app.component";
import {ProductPageComponent} from "./product-page/product-page.component";
import {ProductEditComponent} from "./product-edit/product-edit.component";
import {ProductAddComponent} from "./product-add/product-add.component";
import {WishlistComponent} from "./wishlist/wishlist.component";
import {ShoppingCartComponent} from "./shopping-cart/shopping-cart.component";
import {LoginComponent} from "./auth/login/login.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {GenresComponent} from "./genres/genres.component";
import {FormatsComponent} from "./formats/formats.component";
import {BundlesComponent} from "./bundles/bundles.component";
// import {AuthGuard} from "@angular/fire/auth-guard";

const routes: Routes = [
  {path: '', component: AppComponent},
  {path: 'genres', component: GenresComponent},
  {path: 'formats', component: FormatsComponent},
  {path: 'bundles', component: BundlesComponent},
  {path: 'product/:id', component: AppComponent},
  {path: 'view/:productId', component: ProductPageComponent},
  {path: 'edit/:productId', component: ProductEditComponent},
  {path: 'create-product', component: ProductAddComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: SignupComponent},
  {path: 'wishlist', component: WishlistComponent},
  {path: 'shopping-cart', component: ShoppingCartComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
export { routes };
