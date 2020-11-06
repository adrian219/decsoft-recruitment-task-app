import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AddressBookComponent} from './address-books/address-book/address-book.component';
import {AuthGuard} from '../guard/auth.guard';
import {AddressBooksComponent} from './address-books/address-books.component';

const routes: Routes = [
  { path: '', redirectTo: 'address-books', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'address-books', component: AddressBooksComponent },
  { path: 'address-book/:id', component: AddressBookComponent, canActivate: [AuthGuard] },
  { path: 'address-book', component: AddressBookComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
