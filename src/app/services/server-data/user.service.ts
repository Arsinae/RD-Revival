import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  createUser(uuid: string, user: User) {
    return this.firestore.collection('user').doc(uuid).set({email: user.email, username: user.username, lastLogin: new Date()});
  }

  setLastLogin(uuid: string) {
    return this.firestore.collection('user').doc(uuid).update({lastLogin: new Date()});
  }

  getUserData(uuid: string) {
    return this.firestore.collection('user').doc(uuid).get().pipe(map(res => {
      if (res && res.exists) {
        const user: User = User.formatUser(res.id, res.data());
        return user;
      } else {
        return null;
      }
    }))
  }
}