import { Routes } from '@angular/router';
import { LoginComponent, RegisterComponent } from 'app/pages';

export const AuthLayoutRoutes: Routes = [
    { path: 'login', component: LoginComponent, data: { title: 'Login' } },
    { path: 'register', component: RegisterComponent, data: { title: 'Register' } },
];
