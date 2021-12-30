import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Credential } from '../../models/credential.model';
import { Employee } from '../../models/employee.model';
import { Product } from '../../models/product.model';
import { CredentialService } from '../../services/credential.service';
import { EmployeeService } from '../../services/employee.service';
import { ProductService } from '../../services/product.service';
import { CredentialComponent } from '../credential/credential.component';
import { ProductComponent } from '../product/product.component';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) public credentialsSort: MatSort;
  @ViewChild('credentialsPaginator') public credentialsPaginator: MatPaginator;
  public credentialsDataSource: MatTableDataSource<Credential> = new MatTableDataSource<Credential>();

  @ViewChild(MatSort) public productsSort: MatSort;
  @ViewChild('productsPaginator') public productsPaginator: MatPaginator;
  public productsDataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();

  public matcher = new MyErrorStateMatcher();
  public isEditMode = false;
  public selectedEmployee: Employee;
  public loading = false;

  public employeeFormGroup: FormGroup = new FormGroup({
    firstNameFormControl: new FormControl('', [Validators.required]),
    lastNameFormControl: new FormControl('', [Validators.required]),
    employeeNumberFormControl: new FormControl('', [Validators.required]),
    roleFormControl: new FormControl('', [Validators.required]),
    marketFormControl: new FormControl('', [Validators.required]),
    startDateFormControl: new FormControl('', [Validators.required])
  });

  public get firstName(): AbstractControl {
    return this.employeeFormGroup.get('firstNameFormControl');
  }

  public get lastName(): AbstractControl {
    return this.employeeFormGroup.get('lastNameFormControl');
  }

  public get employeeNumber(): AbstractControl {
    return this.employeeFormGroup.get('employeeNumberFormControl');
  }

  public get role(): AbstractControl {
    return this.employeeFormGroup.get('roleFormControl');
  }

  public get market(): AbstractControl {
    return this.employeeFormGroup.get('marketFormControl');
  }

  public get startDate(): AbstractControl {
    return this.employeeFormGroup.get('startDateFormControl');
  }

  public get displayedColumnsForCredentials(): string[] {
    return ['type', 'username', 'notes', 'actions'];
  }

  public get displayedColumnsForProducts(): string[] {
    return ['name', 'description', 'serialNumber', 'notes', 'actions'];
  }

  constructor(private router: Router,
    private employeeService: EmployeeService,
    private credentialService: CredentialService,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog) { }

  public ngAfterViewInit(): void {
    this.initTableCredentials();
    this.initTableProducts();
  }

  private initTableCredentials(): void {
    this.credentialsDataSource.paginator = this.credentialsPaginator;
    this.credentialsDataSource.sort = this.credentialsSort;

    this.credentialsDataSource.filterPredicate = (data: Credential, filter: string) => {
      return (data.type.toLowerCase() +
        data.username.toLowerCase()).trim().toLowerCase().includes(filter);
    };
  }

  private initTableProducts(): void {
    this.productsDataSource.paginator = this.productsPaginator;
    this.productsDataSource.sort = this.productsSort;

    this.productsDataSource.filterPredicate = (data: Product, filter: string) => {
      return (data.name.toLowerCase() +
        data.description.toLowerCase() +
        data.serialNumber.toLowerCase()).trim().toLowerCase().includes(filter);
    };
  }

  public ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params && params.id && params.id !== 'new') {
        this.loading = true;
        this.employeeService.getEmployeeByNumber(params.id).subscribe(employee => {
          this.setDefaults(employee);

          forkJoin([this.credentialService.getCredentialsByEmployee(employee),
                    this.productService.getProductsByEmployee(employee)]).subscribe(([credentials, products]) => {
                      this.credentialsDataSource.data = credentials;
                      this.productsDataSource.data = products;
                      this.initTableCredentials();
                      this.initTableProducts();
                    }, () => {
                      this.snackBar.open('There was a problem getting the credentials/products, please try again later', 'CLOSE');
                    }).add(() => {
                      this.loading = false;
                    });

        }, () => {
          this.snackBar.open('There was a problem getting the employee, please try again later', 'CLOSE');
        });
      }
    });
  }

  public goToEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.employeeFormGroup.enable();
    } else {
      this.employeeFormGroup.reset();
      this.setDefaults(this.selectedEmployee);
    }
  }


  private setDefaults(employee: Employee): void {
    this.employeeFormGroup.disable();
    this.firstName.setValue(employee.firstName);
    this.lastName.setValue(employee.lastName);
    this.employeeNumber.setValue(employee.employeeNumber);
    this.role.setValue(employee.role);
    this.market.setValue(employee.market);
    this.startDate.setValue(employee.startDate);
    this.selectedEmployee = employee;
  }

  public goBackToEmployees(): void {
    this.router.navigate(['employees']);
  }

  private changedForUpdate(employee: Employee): boolean {
    let changed = false;
    if (this.firstName.value !== this.selectedEmployee.firstName) {
      changed = true;
    }
    if (this.lastName.value !== this.selectedEmployee.lastName) {
      changed = true;
    }
    if (this.employeeNumber.value !== this.selectedEmployee.employeeNumber) {
      changed = true;
    }
    if (this.role.value !== this.selectedEmployee.role) {
      changed = true;
    }
    if (this.market.value !== this.selectedEmployee.market) {
      changed = true;
    }
    if (this.startDate.value !== this.selectedEmployee.startDate) {
      changed = true;
    }
    return changed;
  }

  public saveEmployee(): void {
    this.loading = true;
    if (this.employeeFormGroup.valid) {
      if (this.selectedEmployee) {
        if (this.changedForUpdate(this.selectedEmployee)) {
          const employee: Employee = {
            id: this.selectedEmployee.id,
            firstName: this.firstName.value,
            lastName: this.lastName.value,
            employeeNumber: this.employeeNumber.value,
            role: this.role.value,
            market: this.market.value,
            startDate: this.startDate.value
          };
          this.employeeService.createNewEmployeeOrUpdate(employee, true).subscribe(() => {
            this.router.navigate(['employees']);
          }, ((err: HttpErrorResponse) => {
            if (err.status === 400) {
              this.employeeNumber.setValue(this.selectedEmployee.employeeNumber);
              this.snackBar.open('The new employee number is already assigned to other employee.', 'CLOSE');
            } else {
              this.snackBar.open('There was a problem saving the employee, please try again later', 'CLOSE');
            }
          })).add(() => {
            this.loading = false;
          });
        } else {
          this.router.navigate(['employees']);
        }
      } else {
        const newEmployee: Employee = {
          id: 0,
          firstName: this.firstName.value,
          lastName: this.lastName.value,
          employeeNumber: this.employeeNumber.value,
          role: this.role.value,
          market: this.market.value,
          startDate: this.startDate.value,
          endDate: null
        };

        this.employeeService.createNewEmployeeOrUpdate(newEmployee, false).subscribe(() => {
          this.router.navigate(['employees']);
        }, ((err: HttpErrorResponse) => {
          if (err.status === 400) {
            this.employeeNumber.setValue('');
            this.snackBar.open('This employee number already exists, please insert the correct one or cancel.', 'CLOSE');
          } else {
            this.snackBar.open('There was a problem saving the employee, please try again later.', 'CLOSE');
          }
        })).add(() => {
          this.loading = false;
        });
      }
    } else {
      this.loading = false;
      this.snackBar.open('Please complete the form', 'CLOSE');
    }
  }

  public addNewProduct(): void {
    this.dialog.open(ProductComponent, {
      autoFocus: false,
      width: '500px',
    }).afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        const product: Product = result;
        product.employeeDTO = this.selectedEmployee;
        this.productService.addNewProductToEmployee(product).subscribe((res) => {
          const data = this.productsDataSource.data.slice();
          data.push(res);
          this.productsDataSource.data = data.slice();
          this.initTableProducts();
        }, () => {
          this.snackBar.open('There was a problem adding the product, please try again later', 'CLOSE');
        }).add(() => {
          this.loading = false;
        })
      }
    });
  }

  public addNewCredential(): void {
    this.dialog.open(CredentialComponent, {
      autoFocus: false,
      width: '500px',
    }).afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        const credential: Credential = result;
        credential.employeeDTO = this.selectedEmployee;
        this.credentialService.addNewCredentialToEmployee(credential).subscribe((res) => {
          const data = this.credentialsDataSource.data.slice();
          data.push(res);
          this.credentialsDataSource.data = data.slice();
          this.initTableCredentials();
        }, () => {
          this.snackBar.open('There was a problem adding the credential, please try again later', 'CLOSE');
        }).add(() => {
          this.loading = false;
        })
      }
    });
  }

  public editCredential(credential: Credential): void {
    this.dialog.open(CredentialComponent, {
      autoFocus: false,
      width: '500px',
      data: credential
    }).afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.credentialService.addNewCredentialToEmployee(credential).subscribe((res) => {
          let data = this.credentialsDataSource.data.slice();
          data = data.filter(c => c.id !== credential.id);
          data.push(res);
          this.credentialsDataSource.data = data.slice();
          this.initTableCredentials();
          // TODO: Miss add error
        }, () => {
          this.snackBar.open('There was a problem updating the credential, please try again later', 'CLOSE');
        }).add(() => {
          this.loading = false;
        });
      }
    });
  }

  public search(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.credentialsDataSource.filter = filterValue.toLowerCase();
  }

  public searchProducts(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productsDataSource.filter = filterValue.toLowerCase();
  }

  public deleteCredential(credential: Credential): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '500px'
    }).afterClosed().subscribe(res => {
      if (res) {
        this.loading = true;
        this.credentialService.deleteCredential(credential.id).subscribe( () => {
          let data = this.credentialsDataSource.data.slice();
          data = data.filter(c => c.id !== credential.id);
          this.credentialsDataSource.data = data.slice();
          this.initTableCredentials();
        }, () => {
          this.snackBar.open('There was a problem deleting the credential, please try again later', 'CLOSE');
        }).add(() => this.loading = false );
      }
    });
  }

}
