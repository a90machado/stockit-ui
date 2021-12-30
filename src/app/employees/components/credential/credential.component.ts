import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Credential } from '../../models/credential.model';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-credential',
  templateUrl: './credential.component.html',
  styleUrls: ['./credential.component.scss']
})
export class CredentialComponent implements OnInit {

  public matcher = new MyErrorStateMatcher();
  public title = 'Add a new credential to the employee';

  public credentialFormGroup: FormGroup = new FormGroup({
    typeFormControl: new FormControl('', [Validators.required]),
    usernameFormControl: new FormControl('', [Validators.required]),
    passwordFormControl: new FormControl(''),
    notesFormControl: new FormControl('')
  });

  public get type(): AbstractControl {
    return this.credentialFormGroup.get('typeFormControl');
  }

  public get username(): AbstractControl {
    return this.credentialFormGroup.get('usernameFormControl');
  }

  public get password(): AbstractControl {
    return this.credentialFormGroup.get('passwordFormControl');
  }

  public get notes(): AbstractControl {
    return this.credentialFormGroup.get('notesFormControl');
  }

  constructor(public dialog: MatDialogRef<CredentialComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Credential) { }

  public ngOnInit() {
    if(this.data) {
      this.title = 'Edit the credential of the employee';
      this.setDefaultValues(this.data);
    }
  }

  private setDefaultValues(credential: Credential): void {
    this.type.setValue(credential.type);
    this.username.setValue(credential.username);
    this.password.setValue(credential.password);
    this.notes.setValue(credential.notes);
  }

  public saveCredential(): void {
    if (this.credentialFormGroup.valid) {
      if (this.data) {
        let changed = false;
        const credential: Credential = this.data;
        if (this.type.value !== this.data.type) {
          credential.type = this.type.value;
          changed = true;
        }
        if (this.username.value !== this.data.username) {
          credential.username = this.username.value;
          changed = true;
        }
        if (this.password.value !== this.data.password) {
          credential.password = this.password.value;
          changed = true;
        }
        if (this.notes.value !== this.data.notes) {
          credential.notes = this.notes.value;
          changed = true;
        }
        if (changed) {
          this.dialog.close(credential);
        } else {
          this.dialog.close();
        }
      } else {
        const credential: Credential = {
          id: 0,
          type: this.type.value,
          username: this.username.value,
          password: this.password.value,
          notes: this.notes.value
        }
        this.dialog.close(credential);
      }
    }
  }

}
