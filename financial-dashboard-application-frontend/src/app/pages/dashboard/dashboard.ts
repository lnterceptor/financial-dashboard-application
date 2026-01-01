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

@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe, TransactionListElement, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  authService = inject(AuthService);
  transactionService = inject(TransactionService);
  router = inject(Router);

  currentBalance!: Observable<number>;
  income!: Observable<number>;
  expenses!: Observable<number>;
  netIncome!:Observable<number>;
  transactions!:Observable<Transaction[]>;


  ngOnInit(){
    this.currentBalance = this.transactionService.getCurrentBalance();
    this.income = this.transactionService.getIncome();
    this.expenses = this.transactionService.getExpenses();
    this.netIncome = combineLatest([this.income, this.expenses]).pipe(
      map(([income, expenses]) => income - expenses)
    )
    this.transactions = this.transactionService.getTransactions();
    
  }

  editItem(id: number){
    console.log(id);
  }

  addNewTransaction(){
    console.log('New Transaction popup');
  }
}
