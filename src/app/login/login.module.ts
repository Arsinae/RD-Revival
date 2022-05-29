import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DynamicLocaleId } from '../utils/dynamic-locale';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { AuthActionComponent } from './auth-action/auth-action.component';



@NgModule({
  declarations: [
    LoginComponent,
    ForgetPasswordComponent,
    AuthActionComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  exports: [
    LoginComponent,
    AuthActionComponent
  ],
  entryComponents: [
    ForgetPasswordComponent
  ],
  providers: [
    { provide: LOCALE_ID, useClass: DynamicLocaleId, deps: [TranslateService] },
  ]
})
export class LoginModule { }
