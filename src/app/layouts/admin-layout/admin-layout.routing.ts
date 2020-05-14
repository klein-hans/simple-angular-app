import { Routes } from '@angular/router';
import {
    DashboardComponent,
    UsersComponent,
    AccountComponent,
    AddEditUserComponent
} from 'app/pages';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

export const AdminLayoutRoutes: Routes = [
    { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [AngularFireAuthGuard],
        data: { title: 'Dashboard', authGuardPipe: redirectUnauthorizedToLogin }
    },
    { path: 'users', component: UsersComponent,
        children: [
            { path: 'add',component: AddEditUserComponent },
            { path: 'edit/:id',component: AddEditUserComponent },
        ]
    },
    { path: 'account', component: AccountComponent },
];
