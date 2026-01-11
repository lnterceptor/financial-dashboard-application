import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, tap, firstValueFrom, from, map } from 'rxjs';
import { Category, Transaction } from '../interfaces/transaction';
import { AuthService } from './auth-service';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';

export interface DataPoint{
  x: string,
  y: number
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://localhost:8080/transactions';
  private authService = inject(AuthService);
  private user: User | null = null;
  private userTransactionsSubject = new BehaviorSubject<Transaction[]>([]);
  userTransactions = this.userTransactionsSubject.asObservable();

  constructor(private http:HttpClient){
    this.authService.currentUser.subscribe(user =>
    {
      this.user = user;
    }
    )
  }

  getIncome():Observable<number>{
    return from(this.getIncomeFromBackend())
  }
  async getIncomeFromBackend(){
    let data = 0;
    try {
     data = await firstValueFrom(this.http.get<number>(this.apiUrl + '/getIncome/' + this.user!.id));
    } catch(error){
      console.error('Failed');
    }
     return data;
  }

  
  getExpenses():Observable<number>{
    return from(this.getExpensesFromBackend());
  }

  async getExpensesFromBackend(){
    let data = 0;
    try {
     data = await firstValueFrom(this.http.get<number>(this.apiUrl + '/getExpenses/' + this.user!.id));
    } catch(error){
      console.error('Failed');
    }
     return data;
  }

  getAllTransactions():Observable<Transaction[]>{
    return from(this.setData());
  }

  getRecentTransactions(amount: number): Observable<Transaction[]>{
    return this.getAllTransactions().pipe(
      map((transactions) => {
        return transactions.slice(0, amount)}));
  }

  getSingleTransaction(transaction_id: number){
    for(let i = 0; i < this.userTransactionsSubject.value.length; i++){
      if(this.userTransactionsSubject.value[i].id == transaction_id){
        return this.userTransactionsSubject.value[i];
      }
    }
    return this.userTransactionsSubject.value[0];
  }
  
  async setData(){
    try {
     const data = await firstValueFrom(this.http.get<Transaction[]>(this.apiUrl + '/userTransactions/' + this.user!.id));
     let transactions :Transaction[] = [];
     for(let i = 0; i < transactions.length; i++){
      transactions.push({
        id: data[i].id,
        amount: data[i].amount,
        date_of_transaction: new Date(data[i].date_of_transaction),
        description: data[i].description,
        category: data[i].category,
        user_id: data[i].user_id
      }
      )
     }
     const newData = data.sort((a,b) =>Number(new Date(b.date_of_transaction)) - Number(new Date(a.date_of_transaction)));
     this.userTransactionsSubject.next(newData);
    } catch(error){
      console.error('Failed');
    }
     return this.userTransactionsSubject.value.sort((a,b) => Number(new Date(b.date_of_transaction)) - Number(new Date(a.date_of_transaction)));
  }


  addNewTransaction(amount:number, category:Category, date:Date, description:string): Observable<void>{
    const transaction =
    {amount: amount, category: Object.values(Category[category]).join(''), user_id: this.user!.id 
      , date_of_transaction:date, description: description}
    return this.http.post<void>(this.apiUrl + '/addTransaction', transaction);
  }

  
    editTransaction(id:number, amount:number, category:Category, date:Date, description:string):Observable<void>{
    
    const transaction =
    {id: id, amount: amount, category: Object.values(Category[category]).join(''), user_id: this.user!.id 
      , date_of_transaction:date, description: description}

    return this.http.post<void>(this.apiUrl + '/editTransaction', transaction);
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
      transaction.description.toUpperCase().includes(filterByPhrase.toUpperCase()) || Object.values(Category[Number(Category[transaction.category])]).join('').includes(filterByPhrase.toUpperCase())
      || transaction.date_of_transaction.toString().toUpperCase().includes(filterByPhrase.toUpperCase())
    );
    return of(transactions);
  }

  deleteTransaction(id: number) : Observable<void>{
    return this.http.delete<void>(this.apiUrl + '/deleteTransaction/' + id);
  }
  

  getLastYearLabels(){
    const now = new Date();
    const months = [];
    months.push(new Date(now.getFullYear(), now.getMonth()).toLocaleDateString('pl-PL'));
    for(let i = 11; i > 0; i--){
      const date = new Date( now.getMonth() - i > 0 ? now.getFullYear(): now.getFullYear() -1, now.getMonth() - i > 0 ? now.getMonth() - i : i );
      months.push(date.toLocaleDateString('pl-PL'));
    }
    
    months.sort((a,b)=> Number(new Date(a)) - Number(new Date(b)))
    for(let i = 0; i < months.length; i++){
      months[i] = months[i].slice(2).replace('.', '-');
      months[i] = months[i].split('-')[1] + '-' + months[i].split('-')[0];
    }
    return months;
  }

  transformDataOverTimeForCharts(data: Transaction[]) : DataPoint[] {
    const labels = this.getLastYearLabels();
    const dataPoints: DataPoint[] = [];
    
    for(let i = 0; i < 12; i++){
      dataPoints.push({x : labels[i],y:0});
    }
    for(let i = 0; i < data.length; i++){
      const dataIdx = dataPoints.findIndex(value => value.x === data[i].date_of_transaction.toString().slice(0,7));
      
      if(dataIdx != -1){
        dataPoints[dataIdx].y += data[i].amount;
      }
    }
    return dataPoints;
  }

  getDataForCharts(wantIncome:boolean) : Observable<DataPoint[]>{
    return from(this.setData()).pipe(
      map(() =>{
        return wantIncome === true ? this.transformDataOverTimeForCharts
        (this.userTransactionsSubject.value.filter(transaction => Category[transaction.category].toString() === Category.INCOME.toString())) 
      : this.transformDataOverTimeForCharts
        (this.userTransactionsSubject.value.filter(transaction => Category[transaction.category].toString() !== Category.INCOME.toString()));  
    })
    );
  }

  getExpensesForCharts() : Observable<DataPoint[]>{
    
    if(this.userTransactionsSubject.value.length === 0){
      return from(this.getDataForCharts(false))
    }
    return of(this.transformDataOverTimeForCharts(this.userTransactionsSubject.value.filter(transaction => transaction.category.toString() !== Object.values(Category[Category.INCOME]).join(''))));
  }

  getIncomeForCharts() : Observable<DataPoint[]>{
    if(this.userTransactionsSubject.value.length === 0){
      return from(this.getDataForCharts(true))
    }
    return of(this.transformDataOverTimeForCharts(this.userTransactionsSubject.value.filter(transaction =>
      transaction.category.toString() === Object.values(Category[Category.INCOME]).join(''))));
  }


  getExpensesToPieChart(): Observable<DataPoint[]>{
    const data :DataPoint[] = [];
    if(this.userTransactionsSubject.value.length === 0){
      return from(this.setData()).pipe(
        map(() => {
        for(let i = 0; i < Object.values(Category).filter(key => isNaN(Number(key))).length; i++){
          if(Category[i].toString() !== 'INCOME'){
            data.push(this.getExpensesByCategory(i));
          }
        }
        return data;
        }
      )
      )
    }

    for(let i = 0; i < Object.values(Category).filter(key => isNaN(Number(key))).length; i++){
      if(Category[i].toString() !== 'INCOME'){
        data.push(this.getExpensesByCategory(i));
      }
    }
    return of(data);
  }

  getExpensesByCategory(category: Category): DataPoint{
    let data = this.userTransactionsSubject.value.filter(transaction => 
    transaction.category.toString() === Category[category].toString());
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