import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public email: string = '';
  public password: string = '';

  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) { }

  ngOnInit() {
    /*this.authService.isConnected().subscribe(authState => {
      if (authState) {
        this.authService.setUser(authState.email);
        this.router.navigate(['/home']);
      }
    });*/
  }

  connect() {
    this.authService.authentify(this.email, this.password).then(() => {
      this.authService.setUser(this.email);
      this.router.navigate(['/home']);
    }).catch((err) => {
      this.snackbar.open('Erreur de connexion', 'OK', {panelClass: 'danger-snackbar', duration: 4000});
    });
  }
}
