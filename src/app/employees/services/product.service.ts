import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url = '/api/products/'

  constructor(private httpClient: HttpClient) { }

  public addNewProductToEmployee(product: Product): Observable<Product> {
    return  this.httpClient.post<Product>(this.url, product);
  }

  public getProductsByEmployee(employee: Employee): Observable<Product[]> {
    return this.httpClient.post<Product[]>(this.url + 'employee', employee);
  }

}