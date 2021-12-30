import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from '../../models/employee.model';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-move-products',
  templateUrl: './move-products.component.html',
  styleUrls: ['./move-products.component.scss']
})
export class MoveProductsComponent implements OnInit {

  public matcher = new MyErrorStateMatcher();

  public moveFormGroup: FormGroup = new FormGroup({
    employeeFormControl: new FormControl('', [Validators.required])
  });

  public get employee(): AbstractControl {
    return this.moveFormGroup.get('employeeFormControl');
  }

  constructor(public dialog: MatDialogRef<MoveProductsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Employee[]) { }

  public ngOnInit() {
  }

  public moveProducts(): void {
    if (this.moveFormGroup.valid) {
      this.dialog.close(this.employee.value);
    }
  }

}
