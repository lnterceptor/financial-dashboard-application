import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Category, Transaction } from '../interfaces/transaction';
import { AuthService } from './auth-service';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private authService = inject(AuthService);
  private user: User | null = null;
  private userTransactionsSubject = new BehaviorSubject<Transaction[]>([]);
  userTransactions = this.userTransactionsSubject.asObservable();

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

  getAllTransactions():Observable<Transaction[]>{
    if(this.userTransactionsSubject.value.length == 0){
      this.userTransactionsSubject.next(this.getMockData());
    }
    return of(this.userTransactionsSubject.value);
  }

  getRecentTransactions(amount: number): Observable<Transaction[]>{
    this.getAllTransactions();
    const recentTransactions: Transaction[] = [];
    const amountOfTransactions = amount > this.userTransactionsSubject.value.length ? this.userTransactionsSubject.value.length : amount;
    console.log(this.userTransactionsSubject.value);
    for(let i = 0 ; i < amountOfTransactions; i++ ){
      recentTransactions.push(this.userTransactionsSubject.value[this.returnTransactionPositionInArray(this.userTransactionsSubject.value.length - i)]);
      
    }
    return of(recentTransactions);
  }

  getSingleTransaction(transaction_id: number){
    for(let i = 0; i < this.userTransactionsSubject.value.length; i++){
      if(this.userTransactionsSubject.value[i].id == transaction_id){
        return this.userTransactionsSubject.value[i];
      }
    }
    return this.userTransactionsSubject.value[0]; //change later on to return some kind of error
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
    transactions.sort((a, b) => a.id - b.id);
  return transactions;
  }


  addNewTransaction(amount:number, category:Category, date:Date, description:string){
    const transaction : Transaction = {id: (this.getMaxMockId() + 1), amount: amount, category: category, user_id: this.user!.id , date_of_transaction:date, description: description}
    let transactions :Transaction[]= this.userTransactionsSubject.value;
    transactions.push(transaction);
    this.userTransactionsSubject.next(transactions);
  }
  

  
    editTransaction(id:number, amount:number, category:Category, date:Date, description:string){
    const transaction = this.getSingleTransaction(id);

    transaction.amount = amount;
    transaction.category = category as Category;
    transaction.date_of_transaction = date;
    transaction.description = description;
    const transactions :Transaction[]= this.userTransactionsSubject.value;
    
    transactions[this.returnTransactionPositionInArray(id)] = transaction;
    this.userTransactionsSubject.next(transactions);
  }

  getMaxMockId(): number{
    let maxId = 0;
    for(let i = 0; i < this.userTransactionsSubject.value.length; i++){
      if(maxId < this.userTransactionsSubject.value[i].id){
        maxId = this.userTransactionsSubject.value[i].id
      }
    }
    return maxId;
  }

  returnTransactionPositionInArray(id:number) : number{
    for(let i = 0; i < this.userTransactionsSubject.value.length; i++){
      if(id == this.userTransactionsSubject.value[i].id){
        return i;
      }
    }
    return -1;
  }

}