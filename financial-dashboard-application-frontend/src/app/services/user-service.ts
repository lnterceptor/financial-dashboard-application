import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth-service';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/profile';
  authService = inject(AuthService);
  private user : User| null = null;
  constructor(private http:HttpClient){
    this.authService.currentUser.subscribe(
      user => {this.user = user;}
    )

  }

  changeUserData(username: string, currency: string): Observable<boolean>{
    
    
    const userToBackend={
      id:this.user!.id,
      username:username,
      currency:currency,
      email:this.user!.email
    }
    return this.http.post<User>(this.apiUrl+'/changeData', userToBackend).pipe(
      map(
      userFromBackend =>{
          //todo: return false on error f.ex if username taken
          this.authService.setUser(userFromBackend);
          return true;
    }))

  }

  
  changePassword(password: string, repeatPassword:string ): Observable<boolean>{
   
    const passwordToDb ={
      userId:this.user?.id,
      password:password,
      repeatPassword:repeatPassword
    }
    return this.http.post<String>(this.apiUrl+'/changePassword', passwordToDb).pipe(
      map(
        () =>{
           //todo: implement errors and such connecting to backend
          return true;
        }
      )
    )
  }

}
