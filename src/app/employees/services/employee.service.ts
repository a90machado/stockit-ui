import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private url = '/api/employees'

  constructor(private httpClient: HttpClient) {}

  public createNewEmployeeOrUpdate(employee: Employee, update: boolean): Observable<Employee> {
    return update ? this.httpClient.put<Employee>(this.url, employee) : this.httpClient.post<Employee>(this.url, employee);
  }

  public getAllEmployees(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(this.url);
  }

  public getAllEmployeesInactive(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(this.url + '/inactive');
  }

  public getEmployeeByNumber(id: number): Observable<Employee> {
    return this.httpClient.get<Employee>(this.url + '/' + id);
  }
}
