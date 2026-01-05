import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService = inject(AuthService);
  router = inject(Router);

  logout() : void {
    this.authService.logout();
    this.router.navigateByUrl('sign-in');
  }
  transactionList() : void {
    this.router.navigateByUrl('transaction-list');
  }
  dashboard(): void{
    this.router.navigateByUrl('dashboard');
  }
  profile() :void{
    this.router.navigateByUrl('profile');
  }
  analytics(): void{
    this.router.navigateByUrl('analytics');
  }
}
