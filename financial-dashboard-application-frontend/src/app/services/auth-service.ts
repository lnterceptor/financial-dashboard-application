import { Injectable } from '@angular/core';
import { tap, of, BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user';
@Injectable({
  providedIn: 'root',
})

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(){
    const stored = localStorage.getItem('currentUser');
    if(stored){
      this.currentUserSubject.next(JSON.parse(stored));    
    }
  }
  
  login(credentials: {username: string; password: string}) : Observable<User>{
    const mockUser: User = {
      id: 1,
      username: 'MockUser',
      email: 'MockUser@mockMail.com',
      token: 'Mock-jwt-token'
    };
    return of(mockUser).pipe(
      tap(user => this.setUser(user))
    );
  }

  public register(credentials: {username: string; email: string; password: string}) : Observable<User>{
      const mockUser: User = {
        id: Math.random(),
        username: credentials.username,
        email: credentials.email,
        token: 'Mock-jwt-token'
      }
      return of(mockUser).pipe(
        tap(user => this.setUser(user))
      );
  }

  logout(): void{
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  setUser(mockUser: User): void{
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    this.currentUserSubject.next(mockUser);
  }

  isAuthenticated(): boolean{
    return this.currentUserSubject.value == null ? false : true;
  }

}
