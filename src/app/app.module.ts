import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { NavbarComponent } from './layout/components/navbar/navbar.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeComponent } from './employees/components/employee/employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { APP_DATE_FORMATS } from './shared/constants/app-constants';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CredentialComponent } from './employees/components/credential/credential.component';
import { ProductComponent } from './employees/components/product/product.component';
import { ProductsComponent } from './products/products.component';
import { MoveProductsComponent } from './employees/components/move-products/move-products.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    EmployeesComponent,
    EmployeeComponent,
    CredentialComponent,
    ProductComponent,
    ProductsComponent,
    MoveProductsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
