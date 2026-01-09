import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, of, BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http:HttpClient){
    const stored = localStorage.getItem('currentUser');
    if(stored){
      this.currentUserSubject.next(JSON.parse(stored));    
    }
  }
  
  login(credentials: {username: string; password: string}) {
    const user = {
      username: credentials.username,
      email: credentials.username,
      password: credentials.password,
      
    };
    
    return this.http.post<User>(this.apiUrl + '/login', user).pipe(
      tap(user =>{ 
        this.setUser(user);
      }));    
  }

  register(credentials: {username: string; email: string; password: string, repeatPassword: string}) : Observable<User>{
      const user = {
        email: credentials.email,
        username: credentials.username,
        password: credentials.password,
        repeatPassword: credentials.repeatPassword
      }
 
      return this.http.post<User>(this.apiUrl + '/register', user).pipe(
      tap(
        user =>{ 
        this.setUser(user);
      }));
  }

  logout(): void{
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  setUser(user: User): void{
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  isAuthenticated(): boolean{
    return this.currentUserSubject.value == null ? false : true;
  }

  
}
