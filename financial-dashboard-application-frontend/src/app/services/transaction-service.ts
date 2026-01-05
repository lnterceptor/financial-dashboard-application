import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Category, Transaction } from '../interfaces/transaction';
import { AuthService } from './auth-service';
import { User } from '../interfaces/user';

export interface DataPoint{
  x: string,
  y: number
}

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
    const data = this.getIncomeForCharts();
    let currentBalance = 0;
    data.subscribe(data => {
      for(let i = 0; i < data.length; i++){
        currentBalance += data[i].y;
      }
    });
    return of(currentBalance);
  }
  getExpenses():Observable<number>{
    const data = this.getExpensesForCharts();
    let currentBalance = 0;
    data.subscribe(data => {
      for(let i = 0; i < data.length; i++){
        currentBalance += data[i].y;
      }
    });    
    return of(currentBalance);
  }

  getAllTransactions():Observable<Transaction[]>{
    if(this.userTransactionsSubject.value.length == 0){
      this.userTransactionsSubject.next(this.getMockData());
    }
    return of(this.userTransactionsSubject.value.sort((a,b) => Number(b.date_of_transaction) - Number(a.date_of_transaction)));
  }

  getRecentTransactions(amount: number): Observable<Transaction[]>{
    this.getAllTransactions();
    let recentTransactions: Transaction[] = [];
    const amountOfTransactions = amount > this.userTransactionsSubject.value.length ? this.userTransactionsSubject.value.length : amount;
    
    recentTransactions = this.userTransactionsSubject.value.sort((a,b)=>Number(b.date_of_transaction) - Number(a.date_of_transaction));
    recentTransactions = recentTransactions.slice(0, amount);
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
    const transactions: Transaction[] = [
      {id: 100, amount: 70.00, category: Category.ENTERTAINMENT, user_id: this.user!.id , date_of_transaction:new Date(2025, 3,10), description:'Movie'},
      {id: 91, amount: 69.99, category: Category.OIL, user_id: this.user!.id , date_of_transaction:new Date(2025, 1,1), description:'Gasoline for next week'},
      {id: 81, amount: 100.00, category: Category.GROCERIES, user_id: this.user!.id , date_of_transaction:new Date(2025, 2,22), description:''},
      {id: 75, amount: 220.11, category: Category.FOOD, user_id: this.user!.id , date_of_transaction:new Date(2025, 5,17), description:'Groceries'},
      {id: 61, amount: 120.19, category: Category.OTHERS, user_id: this.user!.id , date_of_transaction:new Date(2025, 4,16), description:'Movie'},
      {id: 53, amount: 120.30, category: Category.OTHERS, user_id: this.user!.id , date_of_transaction:new Date(2026, 0,1), description:'Event on Monday'},
      {id: 42, amount: 120.35, category: Category.OTHERS, user_id: this.user!.id , date_of_transaction:new Date(2025, 8,7), description:'Last Friday'},
      {id: 30, amount: 120.00, category: Category.INCOME, user_id: this.user!.id , date_of_transaction:new Date(2025, 7,10), description:'From Michael'},
      {id: 2, amount: 102.43, category: Category.ENTERTAINMENT, user_id: this.user!.id , date_of_transaction:new Date(2026, 0,2), description:'Concert on Friday'},
      {id: 1, amount: 730.5, category: Category.INCOME, user_id: this.user!.id , date_of_transaction:new Date(2025, 5,11), description:'Income'}
    ];
    transactions.sort((a, b) => b.id - a.id);
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
  filterByPhrase(filterByPhrase: string) : Observable<Transaction[]>{
    let transactions = this.userTransactionsSubject.value.filter(transaction => transaction.amount.toString().includes(filterByPhrase) || 
    transaction.description.toUpperCase().includes(filterByPhrase.toUpperCase()) || Object.values(Category[transaction.category]).join('').includes(filterByPhrase.toUpperCase())
    || transaction.date_of_transaction.toString().toUpperCase().includes(filterByPhrase.toUpperCase())
  );
    return of(transactions);
  }

  deleteTransaction(id: number){
    let transactions = this.userTransactionsSubject.value;
    transactions.splice(transactions.indexOf(this.getSingleTransaction(id)),1);
    this.userTransactionsSubject.next(transactions);
  }
  

  getLastYearLabels(){
    const now = new Date();
    const months = [];
    months.push(new Date(now.getFullYear(), now.getMonth()).toLocaleDateString('en-GB'));
    for(let i = 11; i > 0; i--){
      const date = new Date( now.getMonth() - i > 0 ? now.getFullYear(): now.getFullYear() -1, now.getMonth() - i > 0 ? now.getMonth() - i : i );
      months.push(date.toLocaleDateString('en-GB'));
    }
    
    months.sort((a,b)=> Number(new Date(a)) - Number(new Date(b)))
    for(let i = 0; i < months.length; i++){
      months[i] = months[i].slice(3);
    }
    return months
  }

  transformDataOverTimeForCharts(data: Transaction[]) : DataPoint[] {
    const labels = this.getLastYearLabels();
    const dataPoints: DataPoint[] = [];
    
    for(let i = 0; i < 12; i++){
      dataPoints.push({x : labels[i],y:0});
    }
    for(let i = 0; i < data.length; i++){
      const dataIdx = dataPoints.findIndex(value => value.x === data[i].date_of_transaction.toLocaleDateString('en-GB').slice(3));

      if(dataIdx != -1){
        dataPoints[dataIdx].y += data[i].amount;
      }
    }
    return dataPoints;
  }

  getExpensesForCharts() : Observable<DataPoint[]>{
    
    if(this.userTransactionsSubject.value.length == 0){
      this.userTransactionsSubject.next(this.getMockData());
    }
    
    return of(this.transformDataOverTimeForCharts(this.userTransactionsSubject.value.filter(transaction => transaction.category !== Category.INCOME)));
  }

  getIncomeForCharts() : Observable<DataPoint[]>{
    if(this.userTransactionsSubject.value.length == 0){
      this.userTransactionsSubject.next(this.getMockData());
    }
    return of(this.transformDataOverTimeForCharts(this.userTransactionsSubject.value.filter(transaction => transaction.category === Category.INCOME)));
  }


  getExpensesToPieChart(): Observable<DataPoint[]>{
    const data :DataPoint[] = [];
    for(let i = 0; i < Object.values(Category).filter(key => isNaN(Number(key))).length; i++){
      if(Category[i].toString() !== 'INCOME'){
        data.push(this.getExpensesByCategory(i));
      }
    }
    return of(data);
  }

  getExpensesByCategory(category: Category): DataPoint{
    if(this.userTransactionsSubject.value.length == 0){
      this.userTransactionsSubject.next(this.getMockData());
    }
    let data = this.userTransactionsSubject.value.filter(transaction => transaction.category === category);
    let amount = 0;
    let dataToReturn : DataPoint = {x:'', y:0};

    for(let i = 0; i < data.length; i++){
      amount += data[i].amount;
    }
    dataToReturn.x = Object.values(Category[category]).join('');
    dataToReturn.y = amount;
    return dataToReturn;
  }
}