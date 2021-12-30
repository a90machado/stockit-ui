import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProductComponent } from '../employees/components/product/product.component';
import { Product } from '../employees/models/product.model';
import { ProductService } from '../employees/services/product.service';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {

  public loading = true;
  @ViewChild(MatSort) public productsSort: MatSort;
  @ViewChild('productsPaginator') public productsPaginator: MatPaginator;
  public productsDataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();
  public get displayedColumnsForProducts(): string[] {
    return ['employeeNumber', 'name', 'description', 'serialNumber', 'notes', 'actions'];
  }

  constructor(private productService: ProductService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) { }

  public ngOnInit() {
    this.productService.getProductsOutOfService().subscribe(res => {
      this.productsDataSource.data = res;
    }, () => {
      this.snackBar.open('There was a problem getting the products, please try again later', 'CLOSE');
    }).add(() => {
      this.loading = false;
    });
  }

  public ngAfterViewInit(): void {
    this.initTableProducts();
  }

  public search(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productsDataSource.filter = filterValue.toLowerCase();
  }

  private initTableProducts(): void {
    this.productsDataSource.paginator = this.productsPaginator;
    this.productsDataSource.sort = this.productsSort;

    this.productsDataSource.filterPredicate = (data: Product, filter: string) => {
      return (data.name.toLowerCase() +
        data.description.toLowerCase() +
        data.serialNumber.toLowerCase() +
        data.employeeDTO.employeeNumber.toLowerCase()).trim().toLowerCase().includes(filter);
    };
  }

  public productOutOfService(product: Product): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: 'Are you sure you want to set this product as in service?'
    }).afterClosed().subscribe(res => {
      if (res) {
        this.loading = true;
        product.outOfService = false;
        this.productService.addNewProductToEmployee(product).subscribe(() => {
          let data = this.productsDataSource.data.slice();
          data = data.filter(p => p.id !== product.id);
          this.productsDataSource.data = data.slice();
          this.initTableProducts();
        }, () => {
          this.snackBar.open('There was a problem changing the status of the product, please try again later', 'CLOSE');
        }).add(() => this.loading = false );
      }
    });
  }

  public editProduct(product: Product): void {
    this.dialog.open(ProductComponent, {
      autoFocus: false,
      width: '500px',
      data: product
    }).afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.productService.addNewProductToEmployee(product).subscribe((res) => {
          let data = this.productsDataSource.data.slice();
          data = data.filter(p => p.id !== product.id);
          data.push(res);
          this.productsDataSource.data = data.slice();
          this.initTableProducts();
        }, () => {
          this.snackBar.open('There was a problem updating the product, please try again later', 'CLOSE');
        }).add(() => {
          this.loading = false;
        });
      }
    });
  }

}
