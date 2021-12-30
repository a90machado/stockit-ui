import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeComponent } from './employees/components/employee/employee.component';
import { EmployeesComponent } from './employees/employees.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  { path: 'employee/:id', component: EmployeeComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'products', component: ProductsComponent },
  { path: '', redirectTo: 'employees', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
