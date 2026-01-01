import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category, Transaction } from '../interfaces/transaction';
import { AuthService } from './auth-service';
import { User } from '../interfaces/user';
@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  authService = inject(AuthService);
  user: User | null = null;

  constructor(){
    this.authService.currentUser.subscribe(user =>
    {
      this.user = user;
    }
    )
  }

  getCurrentBalance():Observable<number>{
    const currentBalance = 5410.34;
    return of(currentBalance);
  }

  getIncome():Observable<number>{
    const currentBalance = 4321.00;
    return of(currentBalance);
  }
  getExpenses():Observable<number>{
    const currentBalance = 1234.45;
    return of(currentBalance);
  }

  getTransactions():Observable<Transaction[]>{
    return of(this.getMockData());
  }

  

  getMockData(){
    const time = new Date();
    const transactions: Transaction[] = [
      {id: 10, amount: 70.00, category: Category.ENTERTAINMENT, user_id: this.user!.id , date_of_transaction:time, description:'Movie'},
      {id: 9, amount: 69.99, category: Category.OIL, user_id: this.user!.id , date_of_transaction:time, description:'Gasoline for next week'},
      {id: 8, amount: 100.00, category: Category.GROCERIES, user_id: this.user!.id , date_of_transaction:time, description:''},
      {id: 7, amount: 220.11, category: Category.FOOD, user_id: this.user!.id , date_of_transaction:time, description:'Groceries'},
      {id: 6, amount: 120.19, category: Category.OTHERS, user_id: this.user!.id , date_of_transaction:time, description:'Movie'},
      {id: 5, amount: 120.30, category: Category.OTHERS, user_id: this.user!.id , date_of_transaction:time, description:'Event on Monday'},
      {id: 4, amount: 120.35, category: Category.OTHERS, user_id: this.user!.id , date_of_transaction:time, description:'Last Friday'},
      {id: 3, amount: 120.00, category: Category.INCOME, user_id: this.user!.id , date_of_transaction:time, description:'From Michael'},
      {id: 2, amount: 102.43, category: Category.ENTERTAINMENT, user_id: this.user!.id , date_of_transaction:time, description:'Concert on Friday'},
      {id: 1, amount: 730.5, category: Category.INCOME, user_id: this.user!.id , date_of_transaction:time, description:'Income'}
    ];
  return transactions;
  }
}