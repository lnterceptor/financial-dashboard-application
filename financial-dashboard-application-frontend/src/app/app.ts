import { Component, signal, inject,  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { AuthService } from './services/auth-service';
import { combineLatest, Observable, map } from 'rxjs';
import { User } from './interfaces/user';
import {AsyncPipe} from '@angular/common'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  authService = inject(AuthService);
  currentUser!: Observable<User | null>;
  
  ngOnInit(){
    this.currentUser = this.authService.currentUser; 
  }
  

  protected readonly title = signal('financial-dashboard-application-frontend');
}
