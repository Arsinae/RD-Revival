import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: User = null;

  constructor(
    private auth: AngularFireAuth
  ) { }

  createAccount(mail, password) {
    return this.auth.createUserWithEmailAndPassword(mail, password)
  }

  authentify(mail, password) { // Connecte un compte avec email et mot de passe
    return this.auth.signInWithEmailAndPassword(mail, password);
  }

  disconnect() {
    this.user = null;
    return this.auth.signOut();
  }

  isConnected() { // Retourne l'état de la connexion à un compte
    return this.auth.authState;
  }

  setUser(user: User) {
    this.user = user;
  }

  getCurrentUser() {
    return this.getCurrentUser;
  }

  sendPasswordResetEmail(email) { // Envoie le mail de changement de mot de passe
    return this.auth.sendPasswordResetEmail(email);
  }

  verifyPasswordCode(code) {
    return this.auth.verifyPasswordResetCode(code);
  }

  changePassword(code, password) {
    return this.auth.confirmPasswordReset(code, password);
  }
}
