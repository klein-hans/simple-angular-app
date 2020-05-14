import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { 
  DashboardComponent, 
  UsersComponent, 
  AddEditUserComponent, 
  AccountComponent } from '../../pages';
import { MatDialogModule } from '@angular/material';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatIconModule,
} from '@angular/material';
import { LogoutConfirmationDialogComponent } from 'app/components/logout-confirmation-dialog/logout-confirmation-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule
  ],
  declarations: [
    LogoutConfirmationDialogComponent,
    DashboardComponent,
    UsersComponent,
    AddEditUserComponent,
    AccountComponent,
  ],
  entryComponents: [ LogoutConfirmationDialogComponent ],
})

export class AdminLayoutModule {}
