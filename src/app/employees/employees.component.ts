import { formatDate } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Employee } from './models/employee.model';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit, AfterViewInit {


  @ViewChild(MatSort) public sort: MatSort;
  @ViewChild(MatPaginator) public paginator: MatPaginator;
  public employeesDataSource: MatTableDataSource<Employee> = new MatTableDataSource<Employee>();
  public loadingEmployees = true;

  public get displayedColumns(): string[] {
    return ['firstName', 'employeeNumber', 'role', 'market', 'startDate'];
  }

  constructor(private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  public ngOnInit() {
    this.startComponent();
  }

  public ngAfterViewInit(): void {
    this.employeesDataSource.paginator = this.paginator;
    this.employeesDataSource.sort = this.sort;

    this.employeesDataSource.filterPredicate = (data: Employee, filter: string) => {
      return (data.lastName.toLowerCase() +
        data.firstName.toLowerCase() +
        data.employeeNumber.toLowerCase() +
        formatDate(new Date(data.startDate), 'dd/MM/yyyy', 'en-US')).trim().toLowerCase().includes(filter);
    };
  }

  private startComponent(): void {
    this.employeeService.getAllEmployees().subscribe((res: Employee[]) => {
      this.employeesDataSource.data = res;
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
