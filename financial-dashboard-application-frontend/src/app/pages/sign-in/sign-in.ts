import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})

export class SignIn {
  authService = inject(AuthService);
  http = inject(HttpClient);
  router = inject(Router);
  isValid = true;
  displayedUsernameError = '';
  displayedPasswordError = '';
  minLength = 6;
  minLengthPassword = 8;

  signInForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(this.minLength)]),
    password: new FormControl('', [Validators.required, Validators.minLength(this.minLengthPassword)])
  });

  goToRegister(){
    this.router.navigateByUrl('/sign-up');
  }
  signIn(){
    this.clearErrors();
    if(this.signInForm.valid){
      this.isValid = true;
    const auth = this.authService.login({username: this.signInForm.controls.username.value!, password: this.signInForm.controls.password.value!})
      .subscribe({
        next: () => {this.router.navigateByUrl('/dashboard')}
        , error:(error: HttpErrorResponse)=>{
          this.isValid = false;
          this.displayedPasswordError = error.error?.error;
        }
        
      },
      
    );
      
    }
    else{
      this.isValid = false;
      this.checkErrors();
    }
  }
  clearErrors(){
    this.displayedUsernameError = '';
    this.displayedPasswordError = '';
  }
  checkErrors(){
    this.displayedUsernameError = this.containErrors('username');
    this.displayedPasswordError = this.containErrors('password');
  }
  containErrors(input_to_check: string) : string{
    const contain_errors = this.signInForm.get(input_to_check);
    if(contain_errors?.errors){
      if(contain_errors.errors['required']){
        return 'This field is required';
      }
      else if(contain_errors.errors['minlength']){
        return input_to_check === 'username' ? 'This field must contain at least ' + this.minLength + ' characters.': 'This field must contain at least ' + this.minLengthPassword + ' characters.';
      }
    }
    return '';
  }
}
