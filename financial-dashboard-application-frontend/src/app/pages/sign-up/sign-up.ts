import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  authService = inject(AuthService);
  http = inject(HttpClient);
  router = inject(Router);
  minLengthPassword = 8;
  minLengthUsername = 6;
  isValid = false;
  displayedUsernameError = '';
  displayedPasswordError = '';
  displayedEmailError = '';
  displayedReapeadPasswordError = '';

  signUpForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(this.minLengthUsername)]),
    password: new FormControl('',  [Validators.required, Validators.minLength(this.minLengthPassword)]),
    email: new FormControl('',  [Validators.required, Validators.email]),
    repeatPassword: new FormControl('', [Validators.required, Validators.minLength(this.minLengthPassword)])
  });

  goToSignIn(){
    this.router.navigateByUrl('/sign-in');
  }

  signUp(){
    if(this.signUpForm.valid){
      if(this.signUpForm.get('password')!.value != this.signUpForm.get('repeatPassword')!.value){
        this.clearErrors();
        this.displayedReapeadPasswordError = 'Password and confirmation do not match.';
        return;
      }
      this.isValid = true;
    this.authService.register({username: this.signUpForm.controls.username.value!, email:this.signUpForm.controls.email.value!, password:this.signUpForm.controls.password.value!})
      .subscribe({next: (user) => 
      this.router.navigateByUrl('/dashboard')
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
    this.displayedEmailError = this.containErrors('email');
    this.displayedReapeadPasswordError = this.containErrors('repeatPassword');
  }
  containErrors(input_to_check: string) : string{
    const contain_errors = this.signUpForm.get(input_to_check);
    if(contain_errors?.errors){
      if(contain_errors.errors['required']){
        return 'This field is required';
      }
      else if(contain_errors.errors['minlength']){
        if(input_to_check == 'username'){
          return 'This field must contain at least ' + this.minLengthUsername + ' characters.';
        }
        return 'This field must contain at least ' + this.minLengthPassword + ' characters.';
      }
      else if(contain_errors.errors['email']){
        return 'Inputted email is incorrect.';
      }
    }
    return '';
  }
  clearErrors(){
    this.displayedUsernameError = '';
    this.displayedPasswordError = '';
    this.displayedEmailError = '';
    this.displayedReapeadPasswordError = '';
  }
}
