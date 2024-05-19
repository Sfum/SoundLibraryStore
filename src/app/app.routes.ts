import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductEditComponent} from "./products/product-edit/product-edit.component";
import {ProductAddComponent} from "./products/product-add/product-add.component";
import {WishlistComponent} from "./wishlist/wishlist.component";
import {ShoppingCartComponent} from "./shopping-cart/shopping-cart.component";
import {LoginComponent} from "./auth/login/login.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {GenresComponent} from "./genres/genres.component";
import {FormatsComponent} from "./formats/formats.component";
import {BundlesComponent} from "./bundles/bundles.component";
import {ProviderComponent} from "./provider/provider.component";
import {BrandsComponent} from "./brands/brands.component";
import {HomeComponent} from "./home/home.component";
import {LogoutComponent} from "./auth/logout/logout.component";
import {ProductPageDetailComponent} from "./products/product-page/product-page-detail/product-page-detail.component";
import {BrandAddComponent} from "./brands/brand-add/brand-add.component";
import {BrandEditComponent} from "./brands/brand-edit/brand-edit.component";
import {GenreEditComponent} from "./genres/genre-edit/genre-edit.component";
import {GenreAddComponent} from "./genres/genre-add/genre-add.component";
import {ProfileComponent} from "./auth/profile/profile.component";
import {AdminGuard} from "./guards/admin.guard";
// import {AuthGuard} from "@angular/fire/auth-guard";

const routes: Routes = [
  {path: '', redirectTo: '', pathMatch: 'full'},
  {path: '', component: HomeComponent},
  {path: 'genres', component: GenresComponent},
  {path: 'formats', component: FormatsComponent},
  {path: 'brands', component: BrandsComponent},
  {path: 'bundles', component: BundlesComponent},
  {path: 'provider', component: ProviderComponent, canActivate: [AdminGuard]},
  {path: 'products/:id', component: ProductPageDetailComponent},
  {path: 'add-product', component: ProductAddComponent},
  {path: 'edit/:id', component: ProductEditComponent},
  {path: 'add-brand', component: BrandAddComponent, canActivate: [AdminGuard]},
  {path: 'brand-edit/:_id', component: BrandEditComponent, canActivate: [AdminGuard]},
  {path: 'add-genre', component: GenreAddComponent, canActivate: [AdminGuard]},
  {path: 'genre-edit/:id', component: GenreEditComponent, canActivate: [AdminGuard]},
  {path: 'wishlist', component: WishlistComponent},
  {path: 'shopping-cart', component: ShoppingCartComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'profile', component: ProfileComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
export { routes };
