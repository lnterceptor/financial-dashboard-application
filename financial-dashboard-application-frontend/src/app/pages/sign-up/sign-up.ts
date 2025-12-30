import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  signUpForm = new FormGroup({
    username: new FormControl('', {nonNullable: true}),
    password: new FormControl('',  {nonNullable: true}),
    email: new FormControl('',  {nonNullable: true}),
    repeatPassword: new FormControl('',  {nonNullable: true})
  });

  goToSignIn(){
    console.log('login');
    this.router.navigateByUrl('/sign-in');
  }
  signUp(){
    const username = this.signUpForm.get('username')?.value;
    this.authService.register({username: this.signUpForm.controls.username.value, email:this.signUpForm.controls.email.value, password:this.signUpForm.controls.password.value})
      .subscribe({next: (user) => 
      this.router.navigateByUrl('/dashboard')
      });
  }
}
