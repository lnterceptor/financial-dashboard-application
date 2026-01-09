import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { User } from '../../interfaces/user';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatAnchor } from "@angular/material/button";
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Dialog } from '@angular/cdk/dialog';
import { ChangePassword } from '../change-password/change-password';
import { take } from 'rxjs';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-profile',
  imports: [MatFormField, MatLabel, FormsModule, MatAnchor, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, MatInputModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  dialog = inject(Dialog);
  authService = inject(AuthService);
  userService = inject(UserService);
  user : User | null = null;
  currencies = ['USD', 'EUR', 'PLN', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF'];
  defaultOption = '';
  isValid = false;
  errorMessage = '';
  //name, email, currency with possibility of changing
  //modal that allows for password change
  profileForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl(''),
    currency: new FormControl('')
  })
  constructor(){
    
    this.authService.currentUser.subscribe(
      user => this.user = user
    )
  this.defaultOption = this.user!.currency;
  this.profileForm.patchValue({username: this.user!.username, email: this.user!.email, currency: this.user!.currency});

  }
  
  
  changeData(){
    this.isValid = true;
    if(this.profileForm.valid){
      this.userService.changeUserData(this.profileForm.get('username')?.value ?? '' , this.profileForm.get('currency')?.value ?? '').subscribe({
        next: dataChanged => this.showPopup(dataChanged)
    })
      
      //After connecting backend display message that operation is done in here
    }
    else{
      this.isValid = false;
      if(this.profileForm.get('username')!.errors!['required']){
        this.errorMessage = 'Username is required!';
      }
      else if(this.profileForm.get('username')!.errors!['minlength']){
        this.errorMessage = 'Username is too short!';
      }
    }
  }

  changePassword(){
    this.dialog.open(ChangePassword, {disableClose: true});
    return null;
  }

  showPopup(isValid: boolean){
    //implement showing popups
    return true;
  }
}
