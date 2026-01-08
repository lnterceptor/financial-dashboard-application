import { Component, input, inject, Inject, signal } from '@angular/core';
import { Category } from '../../interfaces/transaction';
import { TransactionService } from '../../services/transaction-service';
import {MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule} from '@angular/material/datepicker'
import { provideNativeDateAdapter  } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { DialogRef } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


type CategoriesToDisplay = [string, number];

@Component({
  selector: 'app-add-transaction',
  imports: [MatDatepickerModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-transaction.html',
  styleUrl: './add-transaction.css',
})

export class AddTransaction {
  private transactionService = inject(TransactionService);
  data = inject(MAT_DIALOG_DATA);
  readonly id = signal(this.data.id);
  amount = signal(this.data.amount);
  category = signal(this.data.category);
  date = signal(this.data.date);
  description = signal(this.data.description);
  private dialogueRef = inject(DialogRef);
  defaultOption = "0";
  isValid = true;
  displayedAmountError = '';
  displayedDateError = '';
  displayedCategoryError = '';
  categoriesToDisplay: CategoriesToDisplay[] = [];

  addTransactionForm = new FormGroup({
    amount: new FormControl(this.amount(), [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    category: new FormControl(this.category(), [Validators.required]),
    date: new FormControl(this.date(), [Validators.required]),
    description: new FormControl(this.description())
  })

  constructor(){
    this.setSelectableCategories();
    
  }

  setSelectableCategories(){
    const amountOfCategories = Object.keys(Category).filter(item => !isNaN(Number(item))).length;

    for(let i = 0; i < amountOfCategories; i++){
      this.categoriesToDisplay.push([Category[i], i]);
    }
    
    this.defaultOption = Category[this.category()].toString();
  }
  

  sendTransactionToBackend(){
    
    if(this.addTransactionForm.valid){
      if(this.addTransactionForm.value.date !== null){
      this.addTransactionForm.get('date')?.setValue(new Date(
        new Date(this.addTransactionForm.value.date).getFullYear(),
        new Date(this.addTransactionForm.value.date).getMonth(),
        new Date(this.addTransactionForm.value.date).getDate(),
        13,0,0));
      }

    this.id() == null ? this.addNewTransaction() : this.editTransaction();
    }
    else{
      this.isValid = false;
      this.checkErrors();
    }
  }

  checkErrors(){
    this.displayedAmountError = this.containErrors('amount');
    this.displayedDateError = this.containErrors('date');
    this.displayedCategoryError = this.containErrors('category');
  }
  containErrors(input_to_check: string) : string{
    const contain_errors = this.addTransactionForm.get(input_to_check);
    if(contain_errors?.errors){
      if(contain_errors.errors['required']){
        return 'This field is required';
      }
      else if(contain_errors.errors['pattern']){
        return 'Wrong format';
      }
    }
    return '';
  }


  addNewTransaction(){
    this.transactionService.addNewTransaction(this.addTransactionForm.get('amount')?.value, Number(this.defaultOption) as Category, this.addTransactionForm.get('date')?.value, this.addTransactionForm.get('description')?.value)
    .subscribe({
      next: () =>  this.closeModal()
    });
  }

  editTransaction(){
    //console.log('data - ', this.addTransactionForm.get('date')?.value,' xDD ', this.date().value);
    this.transactionService.editTransaction(this.id(), this.addTransactionForm.get('amount')?.value, 
    Number(this.defaultOption) as Category, this.addTransactionForm.get('date')?.value, this.addTransactionForm.get('description')?.value).subscribe(
      {
        next: () =>  this.closeModal()
      }
    );
  }

  deleteTransaction(){
    if(this.id() != null){
    this.transactionService.deleteTransaction(this.id()).subscribe(
      {
        next: () => this.closeModal()
      }
    );
    }
  }

  closeModal(){
    this.dialogueRef.close();
  }

}
