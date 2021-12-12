import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,User } from 'firebase/auth';
import {Auth, signOut} from '@angular/fire/auth';
import {Router} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private currentUser: User | null;
  constructor(public auth: Auth, public router: Router) {
    this.auth.onAuthStateChanged(user => this.setCurrentUser(user));
  }

  logOut(): void{

    const auth = getAuth();
    signOut(auth).then(() => {
      console.log('yeej');
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
  }
  checkLoggedIn(): boolean{
   return !!this.currentUser;
  }

logIn(email: string, password: string): void{
    signInWithEmailAndPassword(getAuth(), email, password).then((userCredential) => {
      const user: User = userCredential.user;
      console.log(user);
    }).catch((error) =>{
      const errorCode: string = error.code;
      const errorMessage: string = error.message;

      console.log('errors\n' + errorCode + '\n'+ errorMessage);
    });
}

  createUser(email: string, password: string): void
  {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user: User = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode: string = error.code;
        const errorMessage: string = error.message;

        console.log('errors\n' + errorCode + '\n'+ errorMessage);
      });
  }

  private async setCurrentUser(user: User): Promise<void> {
    this.currentUser = user;
    if (this.currentUser && this.currentUser.phoneNumber !== null) {
      await this.router.navigate(['/']);
    }
    else if (this.currentUser && this.currentUser.phoneNumber === null){
      await this.router.navigate(['/edit-account']);
    }
    else {
      await this.router.navigate(['/login-registration']);
    }
  }
}
