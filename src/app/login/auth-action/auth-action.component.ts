import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PasswordErrorStateMatcher } from '../login.component';

@Component({
  selector: 'app-auth-action',
  templateUrl: './auth-action.component.html',
  styleUrls: ['./auth-action.component.scss']
})
export class AuthActionComponent implements OnInit {

  public authCode: string = null;
  public passwordForm: FormGroup;
  public passwordErrorMatcher: PasswordErrorStateMatcher = new PasswordErrorStateMatcher();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validators: this.checkPasswords
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      if (params.oobCode) {
        this.authCode = params.oobCode;
      }
    })
  }

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => { 
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value
    return pass === confirmPass ? null : { passwordDontMatch: true };
  }

  changePassword() {
    this.authService.verifyPasswordCode(this.authCode).then(result => {
      this.authService.changePassword(this.authCode, this.passwordForm.get('password').value).then(res => {
        this.snackbar.open(this.translate.instant('AUTH_ACTION.PASSWORD_CHANGED'), 'OK', {panelClass: 'primary-snackbar', duration: 4000});
        this.router.navigate(['/login']);
      });
    }).catch(err => {
      console.log(err);
      const commonErrors = {"auth/expired-action-code": "EXPIRED_CODE", "auth/invalid-action-code": 'INVALID_CODE'}
      const msg = (err && commonErrors[err.code] !== undefined) ? commonErrors[err.code] : 'ERROR';
      this.snackbar.open(this.translate.instant(`AUTH_ACTION.${msg}`), 'OK', {panelClass: 'danger-snackbar', duration: 4000});
    })
  }
}
