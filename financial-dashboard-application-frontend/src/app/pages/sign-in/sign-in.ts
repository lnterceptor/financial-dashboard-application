import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  signInForm = new FormGroup({
    username: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {nonNullable: true})
  });

  goToRegister(){
    this.router.navigateByUrl('/sign-up');
  }
  signIn(){
    this.authService.login({username: this.signInForm.controls.username.value, password: this.signInForm.controls.password.value})
      .subscribe({
        next: (user) => this.router.navigateByUrl('/dashboard')
      });
    
  }
}
