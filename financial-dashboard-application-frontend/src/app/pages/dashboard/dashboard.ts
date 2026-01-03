import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction-service';
import { combineLatest, Observable, map } from 'rxjs';
import { Transaction } from '../../interfaces/transaction';
import { toObservable } from '@angular/core/rxjs-interop';
import {AsyncPipe} from '@angular/common'
import { TransactionListElement } from '../../components/transaction-list-element/transaction-list-element';
import { CurrencyPipe } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { AddTransaction } from '../add-transaction/add-transaction';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe, TransactionListElement, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private authService = inject(AuthService);
  private transactionService = inject(TransactionService);
  private dialog = inject(Dialog);
  private amountOfShownTransactions = 5;
  user : User | null = null;

  currentBalance!: Observable<number>;
  income!: Observable<number>;
  expenses!: Observable<number>;
  netIncome!:Observable<number>;
  transactions!:Observable<Transaction[]>;

  constructor(){
    this.authService.currentUser.subscribe(
      user => this.user = user
    )
  }

  ngOnInit(){
    this.currentBalance = this.transactionService.getCurrentBalance();
    this.income = this.transactionService.getIncome();
    this.expenses = this.transactionService.getExpenses();
    this.netIncome = combineLatest([this.income, this.expenses]).pipe(
      map(([income, expenses]) => income - expenses)
    )
    this.transactions = this.transactionService.getRecentTransactions(this.amountOfShownTransactions);
    
  }

  editItem(id: number){
    const dataForModal = this.transactionService.getSingleTransaction(id);
    this.dialog.open(AddTransaction, {disableClose: true, 
      data:{id:id, amount:dataForModal.amount, category: dataForModal.category, date:dataForModal.date_of_transaction, description: dataForModal.description},
      providers:[{provide: MAT_DIALOG_DATA, useValue: {id:id, amount:dataForModal.amount, category: dataForModal.category, date:dataForModal.date_of_transaction, description: dataForModal.description}}]
    });
    this.dialog.afterAllClosed.pipe(take(1)).subscribe(() => {
      this.refreshTransactions();
    });
  }

  addNewTransaction(){
    this.dialog.open(AddTransaction, {disableClose: true,
      data:{id:null, amount:null, category: "0", date:new Date, description: ''},
      providers:[{provide: MAT_DIALOG_DATA, useValue: {id:null, amount:null, category: "0", date:new Date, description: ''}}]
    });
    this.dialog.afterAllClosed.pipe(take(1)).subscribe(() => {
      this.refreshTransactions();
    });
  }

  refreshTransactions(){
    this.transactions = this.transactionService.getRecentTransactions(this.amountOfShownTransactions);
  }
}
