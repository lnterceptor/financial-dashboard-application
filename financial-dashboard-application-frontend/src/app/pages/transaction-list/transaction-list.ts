import { Component } from '@angular/core';
import { Transaction } from '../../interfaces/transaction';
import { TransactionService } from '../../services/transaction-service';
import { inject } from '@angular/core';
import { Observable, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TransactionListElement } from '../../components/transaction-list-element/transaction-list-element';
import { Dialog } from '@angular/cdk/dialog';
import { AddTransaction } from '../add-transaction/add-transaction';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Category } from '../../interfaces/transaction';

@Component({
  selector: 'app-transaction-list',
  imports: [AsyncPipe, TransactionListElement, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})
export class TransactionList {
  transactionService = inject(TransactionService);
  transactions !: Observable<Transaction[]>; 
  dialog = inject(Dialog);
  inputValue = '';

  ngOnInit(){
    this.transactions = this.transactionService.getAllTransactions();
  }

  addNewTransaction(){
    this.inputValue = '';
    this.dialog.open(AddTransaction, { disableClose: true,
        data:{id:null, amount:null, category: Object.values(Category[Category.INCOME]).join(''), date:new Date, description: ''},
        providers:[{provide: MAT_DIALOG_DATA, useValue: {id:null, amount:null, category:Object.values(Category[Category.INCOME]).join(''), date:new Date, description: ''}}]
    });
    this.dialog.afterAllClosed.pipe(take(1)).subscribe(() => this.refreshTransactions());
  }
  
  editTransaction(id: number){
    const transaction = this.transactionService.getSingleTransaction(id);
    this.inputValue = '';
    this.dialog.open(AddTransaction, { disableClose: true,
        data:{id:id, amount:transaction.amount, category:transaction.category, date:transaction.date_of_transaction, description:transaction.description},
        providers:[{provide: MAT_DIALOG_DATA, useValue: {id:id, amount:transaction.amount, category:transaction.category, date:transaction.date_of_transaction, description: transaction.description}}]
    });
    
    this.dialog.afterAllClosed.pipe(take(1)).subscribe(() => this.refreshTransactions())
  }

  refreshTransactions(){
    this.transactions = this.transactionService.getAllTransactions();
  }


  filterTransactions(filterByPhrase: string){
    this.transactions = this.transactionService.filterByPhrase(filterByPhrase);
  }
}
