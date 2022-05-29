import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../models/user';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/server-data/user.service';

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
    this.authService.isConnected().subscribe(authState => {
      if (authState) {
        this.getConnectedUser(authState.uid);
      }
    });
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
      const msg = (err && commonErrors[err.code] === undefined) ? commonErrors[err.code] : 'ERROR';
      this.snackbar.open(this.translate.instant(`LOGIN.${msg}`), 'OK', {panelClass: 'danger-snackbar', duration: 4000});
    });
  }

  getConnectedUser(userUid: string) {
    this.userService.getUserData(userUid).toPromise().then(user => {
      if (user) {
        this.authService.setUser(user);
        this.router.navigate(['/home']);
      } else {
        this.snackbar.open(this.translate.instant(`LOGIN.ERROR`), 'OK', {panelClass: 'danger-snackbar', duration: 4000});
      }
    })
  }

  createAccount()  {
    this.authService.createAccount(this.signUpForm.get('email').value, this.signUpForm.get('password').value).then(res => {
      console.log(res);
      const newUser: User = User.setNewUser(this.signUpForm);
      this.userService.createUser(res.user.uid, newUser).then(resUser => {
        newUser.uuid = res.user.uid;
        this.snackbar.open(this.translate.instant('SIGNUP.CREATED'), 'OK', {panelClass: 'primary-snackbar', duration: 4000});
        this.authService.setUser(newUser);
        this.router.navigate(['/home']);
      })
    }).catch(err => {
      console.log(err);
      const commonErrors = {"auth/email-already-in-use": "EMAIL_ALREADY_USE", "auth/invalid-email": 'INVALID_EMAIL', "uth/weak-password": "WEAK_PASSWORD"}
      const msg = (err && commonErrors[err.code] === undefined) ? commonErrors[err.code] : 'ERROR';
      this.snackbar.open(this.translate.instant(`SIGNUP.${msg}`), 'OK', {panelClass: 'danger-snackbar', duration: 4000});
    })
  }
}

export class PasswordErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const dontMatch = form && form.hasError('passwordDontMatch');
    return !!(control && !control.invalid && (control.dirty || control.touched) && dontMatch);
  }
}