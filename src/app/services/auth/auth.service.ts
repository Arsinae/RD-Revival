import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentEmail: string = null;

  constructor(
    private auth: AngularFireAuth
  ) { }

  authentify(mail, password) { // Connecte un compte avec email et mot de passe
    return this.auth.signInWithEmailAndPassword(mail, password);
  }

  disconnect() {
    this.currentEmail = '';
    return this.auth.signOut();
  }

  isConnected() { // Retourne l'état de la connexion à un compte
    return this.auth.authState;
  }

  setUser(email) {
    this.currentEmail = email;
  }

  getCurrentEmail() {
    return this.currentEmail;
  }

  sendPasswordResetEmail(email) { // Envoie le mail de changement de mot de passe
    return this.auth.sendPasswordResetEmail(email);
  }

  async changePassword(code, password) { // Valide le changement de mot de passe d'un compte
    const valid = this.auth.verifyPasswordResetCode(code);
    if (valid) {
      await this.auth.confirmPasswordReset(code, password);
    }
    return valid;
  }
}
