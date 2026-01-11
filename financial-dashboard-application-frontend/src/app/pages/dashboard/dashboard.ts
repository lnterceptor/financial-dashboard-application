import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { TransactionService } from '../../services/transaction-service';
import { combineLatest, Observable, map } from 'rxjs';
import { Category, Transaction } from '../../interfaces/transaction';
import {AsyncPipe} from '@angular/common'
import { TransactionListElement } from '../../components/transaction-list-element/transaction-list-element';
import { CurrencyPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddTransaction } from '../add-transaction/add-transaction';
import { User } from '../../interfaces/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe, TransactionListElement, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard {
  private authService = inject(AuthService);
  private transactionService = inject(TransactionService);
  private dialog = inject(MatDialog);
  private amountOfShownTransactions = 5;
  user : User | null = null;

  income!: Observable<number>;
  expenses!: Observable<number>;
  netIncome!:Observable<number>;
  transactions!:Observable<Transaction[]>;

  constructor(public snackBar: MatSnackBar){
    this.authService.currentUser.subscribe(
      user => this.user = user
    )
  }

  ngOnInit(){
    this.income = this.transactionService.getIncome();
    this.expenses = this.transactionService.getExpenses();
    this.netIncome = combineLatest([this.income, this.expenses]).pipe(
      map(([income, expenses]) => income - expenses)
    )
    this.transactions = this.transactionService.getRecentTransactions(this.amountOfShownTransactions);
    
  }

  editItem(id: number){
    const dataForModal = this.transactionService.getSingleTransaction(id);
    const dialogRef = this.dialog.open(AddTransaction, {disableClose: true, 
      data:{id:id, amount:dataForModal.amount, category: dataForModal.category, date:dataForModal.date_of_transaction, description: dataForModal.description}
    });
    dialogRef.afterClosed().subscribe(
      data => {
        this.showPopup(data);
        this.refreshTransactions();
      });
 
  }

  addNewTransaction(){
    const dialogRef = this.dialog.open(AddTransaction, {disableClose: true,
      data:{id:null, amount:null, category: Object.values(Category[Category.INCOME]).join(''), date:new Date, description: ''}
    });
    dialogRef.afterClosed().subscribe(
      data => {
        this.showPopup(data);
        this.refreshTransactions();

      }
    );
  }

  refreshTransactions(){
    this.transactions = this.transactionService.getRecentTransactions(this.amountOfShownTransactions);
    this.income = this.transactionService.getIncome();
    this.expenses = this.transactionService.getExpenses();
    this.netIncome = combineLatest([this.income, this.expenses]).pipe(
      map(([income, expenses]) => income - expenses)
    )
  }

  showPopup(data: string){
    if(data !== ''){
      this.snackBar.open(data, '', {duration: 2000,horizontalPosition: 'right', verticalPosition: 'top' , panelClass: ['snackbar']});
    }
    return true;
  }
  
}
