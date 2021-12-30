import { formatDate } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { Employee } from './models/employee.model';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {


  @ViewChild(MatSort) public sort: MatSort;
  @ViewChild(MatPaginator) public paginator: MatPaginator;
  public employeesDataSource: MatTableDataSource<Employee> = new MatTableDataSource<Employee>();
  public loadingEmployees = true;
  public employeeActive = true;
  public get displayedColumns(): string[] {
    return ['firstName', 'employeeNumber', 'role', 'market', 'startDate', 'endDate', 'actions'];
  }

  constructor(private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router) { }

  public ngOnInit() {
    this.getActiveEmployees();
  }

  public getEmployees(): void {
    this.loadingEmployees = true;
    this.employeeActive = !this.employeeActive;
    if (this.employeeActive) {
      this.getActiveEmployees();
    } else {
      this.getInactiveEmployees();
    }
  }

  public deactivateEmployee(employee: Employee): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: 'Are you sure you want to end the service of this employee?'
    }).afterClosed().subscribe(res => {
      if (res) {
        this.loadingEmployees = true;
        employee.endDate = new Date();
        this.employeeService.createNewEmployeeOrUpdate(employee, true).subscribe(() => {
          this.getActiveEmployees();
        }, () => {
          this.snackBar.open('There was a problem ending the service of the employee, please try again later', 'CLOSE');
        });
      }
    });
  }

  public activateEmployee(employee: Employee): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: 'Are you sure you want to put this employee active?'
    }).afterClosed().subscribe(res => {
      if (res) {
        this.loadingEmployees = true;
        employee.endDate = null;
        this.employeeService.createNewEmployeeOrUpdate(employee, true).subscribe(() => {
          this.getInactiveEmployees();
        }, () => {
          this.snackBar.open('There was a problem ending the service of the employee, please try again later', 'CLOSE');
        });
      }
    });
  }

  private initTable(): void {
    this.employeesDataSource.paginator = this.paginator;
    this.employeesDataSource.sort = this.sort;

    this.employeesDataSource.filterPredicate = (data: Employee, filter: string) => {
      return (data.lastName.toLowerCase() +
        data.firstName.toLowerCase() +
        data.employeeNumber.toLowerCase() +
        formatDate(new Date(data.startDate), 'dd/MM/yyyy', 'en-US')).trim().toLowerCase().includes(filter);
    };
  }

  private getActiveEmployees(): void {
    this.employeeService.getAllEmployees().subscribe((res: Employee[]) => {
      this.employeesDataSource.data = res;
      this.initTable();
    }, () => {
      this.snackBar.open('There was a problem fetching the employees, please try again later', 'CLOSE');
    }).add(() => this.loadingEmployees = false);
  }

  private getInactiveEmployees(): void {
    this.employeeService.getAllEmployeesInactive().subscribe((res: Employee[]) => {
      this.employeesDataSource.data = res;
      this.initTable();
    }, () => {
      this.snackBar.open('There was a problem fetching the employees, please try again later', 'CLOSE');
    }).add(() => this.loadingEmployees = false);
  }

  public search(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.employeesDataSource.filter = filterValue.toLowerCase();
  }

  public navigateTooEmployeePage(id?: number): void {
    this.router.navigate(['employee/' + (id ? id : 'new')]);
  }
}
