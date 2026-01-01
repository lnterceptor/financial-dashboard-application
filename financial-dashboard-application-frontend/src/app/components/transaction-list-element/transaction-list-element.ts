import { Component, input, output } from '@angular/core';
import { Category } from '../../interfaces/transaction';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-transaction-list-element',
  imports: [CurrencyPipe],
  template: `
    <div class="list-element">
    <div class="list-row">
      <div class="single-row">
        Cost: {{amount() | currency }} Category: {{getCategoryName()}}
      </div>
      <div class="single-row">
        Transactions date: {{date_of_transaction()}}
      </div>
       <div class="single-row">
        Description: {{description()}}
      </div>
    </div>
      <button class="button" (click)="editItem()">Edit</button>
    </div>
    `,
  styles: `
  
  .list-element{
    background-color: rgba(0, 231, 154, 1);
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 80cqw;
    justify-content: space-between;
    margin: 2cqh;
    border-radius: 15px;
  }
  .button{
    margin-right: 7%;
    height: 8cqh;
    width: 12cqw;
    border-radius: 15px;
  }
  .list-row{
    display: flex;
    flex-direction: column;
    font-size: 20px;
    gap:2cqw;
    margin: 1%;
    }`,
})
export class TransactionListElement {
    readonly amount = input<number>();
    readonly category = input<Category>();
    readonly id = input<number>();
    readonly date_of_transaction = input<Date>();
    readonly description = input<string>();

    readonly editItemEvent = output<number>();
    
    editItem(){
      this.editItemEvent.emit(this.returnItem());
    }
    
    returnItem():number{
        return this.id() == null ? 0 : this.id()!;
    }
    getCategoryName(): string{
      return Category[this.category() == null ? 0 : this.category()!];
    }

}