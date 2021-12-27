import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Credential } from '../models/credential.model';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class CredentialService {

  private url = '/api/credentials/'

  constructor(private httpClient: HttpClient) { }

  public addNewCredentialToEmployee(credential: Credential): Observable<Credential> {
    return  this.httpClient.post<Credential>(this.url, credential);
  }

  public getCredentialsByEmployee(employee: Employee): Observable<Credential[]> {
    return this.httpClient.post<Credential[]>(this.url + 'employee', employee);
  }

  public deleteCredential(id: number): Observable<void> {
    return this.httpClient.delete<void>(this.url + 'credential/' + id);
  }


}
