import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,User } from 'firebase/auth';
// eslint-disable-next-line max-len
import {Auth, signOut, updateCurrentUser, updateEmail, updatePassword, updatePhoneNumber, PhoneAuthProvider, PhoneAuthCredential} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {Capacitor} from '@capacitor/core';
@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private currentUser: User | null;
  private verificationCode: string;
  private verificationId: string;

  constructor(public auth: Auth, public router: Router, public alertController: AlertController) {
    this.auth.onAuthStateChanged(user => this.setCurrentUser(user));
  }
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Verifieër je telefoonnummer!',
      inputs: [
        {
          name: 'phone',
          placeholder: 'vul je telefoonnummer in'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          handler: (data) => {
            this.verificationCode = data.phone;
            console.log(this.verificationCode);
          },
        },
      ],
    });

    await alert.present();
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




  async updateProfile(email: string, wachtwoord: string, telefoon: string){
    console.log(email + '\n' + wachtwoord + '\n' + telefoon);
    if (email !== undefined){
      await updateEmail(this.currentUser, email);
    }
    if (wachtwoord !== undefined){
      await updatePassword(this.currentUser, wachtwoord);
    }

    if (telefoon !== undefined){
      if (!Capacitor.isNativePlatform()) {
        return;
      }
    }
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
