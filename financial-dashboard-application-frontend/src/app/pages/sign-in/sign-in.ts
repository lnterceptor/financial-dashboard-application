import { HttpClient } from '@angular/common/http';
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
  minLength = 4;

  signInForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(this.minLength)]),
    password: new FormControl('', [Validators.required, Validators.minLength(this.minLength)])
  });

  goToRegister(){
    this.router.navigateByUrl('/sign-up');
  }
  signIn(){
    if(this.signInForm.valid){
      this.isValid = true;
    this.authService.login({username: this.signInForm.controls.username.value!, password: this.signInForm.controls.password.value!})
      .subscribe({
        next: (user) => this.router.navigateByUrl('/dashboard')
      });
    }
    else{
      this.isValid = false;
      this.checkErrors();
    }
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
        return 'This field must contain at least ' + this.minLength + ' characters.';
      }
    }
    return '';
  }
}
