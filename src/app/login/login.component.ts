import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../models/user';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/server-data/user.service';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public signUpForm: FormGroup;
  public passwordErrorMatcher: PasswordErrorStateMatcher = new PasswordErrorStateMatcher();

  public type: string = 'login';

  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validators: this.checkPasswords
    });
  }

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => { 
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value
    return pass === confirmPass ? null : { passwordDontMatch: true };
  }

  ngOnInit() {
    /*this.authService.isConnected().subscribe(authState => {
      if (authState) {
        this.getConnectedUser(authState.uid);
      }
    });*/
  }

  switchPage(type) {
    this.type = type;
  }

  connect() {
    this.authService.authentify(this.loginForm.get('email').value, this.loginForm.get('password').value).then((auth) => {
      console.log(auth);
      this.getConnectedUser(auth.user.uid);
    }).catch((err) => {
      console.log(err);
      const commonErrors = {"auth/user-not-found": "EMAIL_NOT_FOUND", "auth/wrong-password": 'INVALID_PASSWORD', "user-disabled": "USER_DISABLED"}
      const msg = (err && commonErrors[err.code] !== undefined) ? commonErrors[err.code] : 'ERROR';
      this.snackbar.open(this.translate.instant(`LOGIN.${msg}`), '', {panelClass: 'danger-snackbar', duration: 4000});
    });
  }

  getConnectedUser(userUid: string) {
    this.userService.getUserData(userUid).toPromise().then(user => {
      if (user) {
        this.authService.setUser(user);
        this.router.navigate(['/home']);
      } else {
        this.snackbar.open(this.translate.instant(`LOGIN.ERROR`), '', {panelClass: 'danger-snackbar', duration: 4000});
      }
    })
  }

  createAccount()  {
    this.authService.createAccount(this.signUpForm.get('email').value, this.signUpForm.get('password').value).then(res => {
      console.log(res);
      const newUser: User = User.setNewUser(this.signUpForm);
      this.userService.createUser(res.user.uid, newUser).then(resUser => {
        newUser.uuid = res.user.uid;
        console.log(newUser)
        this.snackbar.open(this.translate.instant('SIGNUP.CREATED'), '', {panelClass: 'primary-snackbar', duration: 4000});
        this.authService.setUser(newUser);
        this.router.navigate(['/home']);
      })
    }).catch(err => {
      console.log(err);
      const commonErrors = {"auth/email-already-in-use": "EMAIL_ALREADY_USE", "auth/invalid-email": 'INVALID_EMAIL', "uth/weak-password": "WEAK_PASSWORD"}
      const msg = (err && commonErrors[err.code] !== undefined) ? commonErrors[err.code] : 'ERROR';
      console.log(msg, commonErrors[err.code]);
      this.snackbar.open(this.translate.instant(`SIGNUP.${msg}`), '', {panelClass: 'danger-snackbar', duration: 4000});
    })
  }

  forgetPassword() {
    this.dialog.open(ForgetPasswordComponent, {data: {email: this.loginForm.get('email').value}, width: '80%', panelClass: 'dark-theme'}).afterClosed().subscribe(res => {
      if (res) {
        this.authService.sendPasswordResetEmail(res.email).then(() => {
          this.snackbar.open(this.translate.instant('FORGET_PASSWORD.MAIL_SENT'), '', {panelClass: 'primary-snackbar', duration: 4000});
        }).catch((err) => {
          const commonErrors = {"auth/user-not-found": "USER_NOT_FOUND", "auth/invalid-email": 'INVALID_EMAIL'}
          const msg = (err && commonErrors[err.code] !== undefined) ? commonErrors[err.code] : 'ERROR';
          this.snackbar.open(this.translate.instant(`FORGET_PASSWORD.${msg}`), '', {panelClass: 'danger-snackbar', duration: 4000});
        })
      }
    })
  }
}

export class PasswordErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const dontMatch = form && form.hasError('passwordDontMatch');
    return !!(control && !control.invalid && (control.dirty || control.touched) && dontMatch);
  }
}