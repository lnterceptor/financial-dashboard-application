import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatAnchor } from "@angular/material/button";
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user-service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-change-password',
  imports: [MatFormField, MatLabel, FormsModule, MatAnchor, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, MatInputModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {
  isValid = false;
  errorRepeatPassword = '';
  errorPassword = '';
  private dialogueRef = inject(MatDialogRef);
  private authService = inject(AuthService);
  private passwordMinLength = 8;
  private userService = inject(UserService);
  changePasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(this.passwordMinLength)]),
    repeatPassword: new FormControl('', [Validators.required])    
  })

  closeDialogue(data: string){
    this.dialogueRef.close(data);
  }
  changePassword(){
    if(this.changePasswordForm.valid && this.changePasswordForm.get('password')?.value === this.changePasswordForm.get('repeatPassword')?.value){
      this.isValid = true;
      this.userService.changePassword(this.changePasswordForm.get('password')?.value??"", this.changePasswordForm.get('repeatPassword')?.value??"").subscribe(
        {
          next: data =>{
                this.closeDialogue('Password changed');
          }
        }
      )
      
    }
    else{
      this.isValid = false;
      this.displayErrors()
    }
  }

  displayErrors(){
    const passwordErrors = this.changePasswordForm.get('password');
    const repeatPasswordErrors = this.changePasswordForm.get('repeatPassword');
    this.clearErrors();
    if(passwordErrors?.errors){
      if(passwordErrors.errors['required']){
        this.errorPassword = 'Value cannot be empty';
      }
      else if(passwordErrors.errors['minlength']){
        this.errorPassword = 'Password is too short';
      }
    }
    
    if(repeatPasswordErrors?.errors){
      if(repeatPasswordErrors.errors['required']){
        this.errorRepeatPassword = 'Value cannot be empty';
      }
    }
    else if(this.changePasswordForm.get('password')?.value != this.changePasswordForm.get('repeatPassword')?.value){
      this.errorRepeatPassword = 'Passwords are not identical!';
    }
    
  }
  clearErrors(){
    this.errorRepeatPassword = '';
    this.errorPassword = '';
  }
}