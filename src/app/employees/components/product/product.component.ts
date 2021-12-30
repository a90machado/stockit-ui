import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../models/product.model';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  public matcher = new MyErrorStateMatcher();
  public title = 'Add a new product to the employee';

  public productFormGroup: FormGroup = new FormGroup({
    nameFormControl: new FormControl('', [Validators.required]),
    descriptionFormControl: new FormControl('', [Validators.required]),
    serialNumberFormControl: new FormControl(''),
    notesFormControl: new FormControl('')
  });

  public get name(): AbstractControl {
    return this.productFormGroup.get('nameFormControl');
  }

  public get description(): AbstractControl {
    return this.productFormGroup.get('descriptionFormControl');
  }

  public get serialNumber(): AbstractControl {
    return this.productFormGroup.get('serialNumberFormControl');
  }

  public get notes(): AbstractControl {
    return this.productFormGroup.get('notesFormControl');
  }

  constructor(public dialog: MatDialogRef<ProductComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Product) { }

  public ngOnInit() {
    if (this.data) {
      this.title = 'Edit the product of the employee';
      this.setDefaultValues(this.data);
    }
  }

  private setDefaultValues(product: Product): void {
    this.name.setValue(product.name);
    this.description.setValue(product.description);
    this.serialNumber.setValue(product.serialNumber);
    this.notes.setValue(product.notes);
  }

  public saveProduct(): void {
    if (this.productFormGroup.valid) {
      if (this.data) {
        let changed = false;
        const product: Product = this.data;
        if (this.name.value !== this.data.name) {
          product.name = this.name.value;
          changed = true;
        }
        if (this.description.value !== this.data.description) {
          product.description = this.description.value;
          changed = true;
        }
        if (this.serialNumber.value !== this.data.serialNumber) {
          product.serialNumber = this.serialNumber.value;
          changed = true;
        }
        if (this.notes.value !== this.data.notes) {
          product.notes = this.notes.value;
          changed = true;
        }
        if (changed) {
          this.dialog.close(product);
        } else {
          this.dialog.close();
        }
      } else {
        const product: Product = {
          id: 0,
          name: this.name.value,
          description: this.description.value,
          serialNumber: this.serialNumber.value,
          notes: this.notes.value,
          outOfService: false
        }
        this.dialog.close(product);
      }
    }
  }

}
