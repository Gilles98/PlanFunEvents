import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,User } from 'firebase/auth';
// eslint-disable-next-line max-len
import {
  Auth,
  signOut,
  updateCurrentUser,
  updateEmail,
  updatePassword,
  updatePhoneNumber,
  PhoneAuthProvider,
  PhoneAuthCredential,
  signInWithCredential, signInWithPhoneNumber, updateProfile
} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {FirebaseAuthentication} from '@robingenz/capacitor-firebase-authentication';
import {Capacitor} from '@capacitor/core';
import {Photo} from '@capacitor/camera';
import {FireStorageService} from '../fireStorageService/fire-storage.service';
@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private cred: any = null;
  private currentUser: User | null;
  private verificationCode: string;
  private verificationId: string;

  constructor(public auth: Auth, public router: Router, public alertController: AlertController, public fireStorageService: FireStorageService) {
    this.auth.onAuthStateChanged(user => this.setCurrentUser(user));

  }
  returnCurrentUser(){
    return this.currentUser;
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




  async updateProfile(email: string, wachtwoord: string, displayName: string, foto: Photo){
    console.log(email + '\n' + wachtwoord + '\n' + displayName);
    if (email !== undefined){
      await updateEmail(this.currentUser, email);
    }
    if (wachtwoord !== undefined){
      await updatePassword(this.currentUser, wachtwoord);
    }

    if (displayName !== undefined){
      await updateProfile(this.auth.currentUser, {
        displayName
      });
    }

    if (foto !== undefined){
      const url: string = await this.fireStorageService.saveProfileImage(foto, this.currentUser);
      console.log(url + ' '+  foto);
      await updateProfile(this.auth.currentUser, {photoURL: url});
      this.currentUser = await getAuth().currentUser;
    }

   /* if (telefoon !== undefined){
      // of this course.
      if (!Capacitor.isNativePlatform()) {
        return;
      }

      // We can't log in through the plug-in here, we must either choose
      // authentication on the web layer, or on the native layer.
      // A verification code can only be used once.
      const {verificationId} = await FirebaseAuthentication.signInWithPhoneNumber({phoneNumber: telefoon});
      this.verificationId = verificationId;
      await this.presentAlertPrompt();
      const credential = PhoneAuthProvider.credential(this.verificationId, this.verificationCode);
      await updatePhoneNumber(this.currentUser, credential);
    }*/
    await this.router.navigate(['/']);
  }
logIn(email: string, password: string): void{
    signInWithEmailAndPassword(getAuth(), email, password).then((userCredential) => {
      const user: User = userCredential.user;
      console.log(user);
      console.log(getAuth().currentUser.phoneNumber);
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
    if (this.currentUser) {
      await this.router.navigate(['/']);
    }
    else {
      await this.router.navigate(['/login-registration']);
    }
  }
}
