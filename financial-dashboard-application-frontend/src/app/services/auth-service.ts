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

  setUser(mockUser: User): void{
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    this.currentUserSubject.next(mockUser);
  }

  isAuthenticated(): boolean{
    return this.currentUserSubject.value == null ? false : true;
  }

  changeUserData(username: string, currency: string): Observable<boolean>{
    //todo: verify after backend if username not taken
    let tempUser = this.currentUserSubject.value;
    tempUser!.currency = currency;
    tempUser!.username = username;
    this.currentUserSubject.next(tempUser);
    return of(true);
  }

  changePassword(password: string ): Observable<boolean>{
    //todo: implement after connecting to backend
    return of(true);
  }

}
