import { Routes } from '@angular/router';
import { SignIn } from './pages/sign-in/sign-in';
import { SignUp } from './pages/sign-up/sign-up';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { TransactionList } from './pages/transaction-list/transaction-list';


export const routes: Routes = [
    {path: '', component: Dashboard, pathMatch: 'full',
         canActivate:[authGuard]},
    {path: 'dashboard', component: Dashboard, 
        canActivate: [authGuard]
    },
    {path: 'sign-in', component: SignIn},
    {path: 'sign-up', component: SignUp},
    {path: 'transaction-list', component: TransactionList,
        canActivate: [authGuard]
    }
];
