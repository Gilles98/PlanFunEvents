import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,User } from 'firebase/auth';
import {
  collection,
  CollectionReference,
  Firestore,
  doc,
  DocumentReference,
  addDoc, getDocs, query, orderBy, where, getDoc, setDoc, updateDoc
} from '@angular/fire/firestore';
// eslint-disable-next-line max-len
import {
  Auth,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile
} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {Photo} from '@capacitor/camera';
import {FireStorageService} from '../fireStorageService/fire-storage.service';
import FirestoreUser from '../Datatypes/Classes/FirestoreUser';
import {update} from '@angular/fire/database';
import {Event} from '../Datatypes/Classes/Event';
import {EventService} from '../eventService/event.service';
import {ErrorService} from '../ErrorService/error.service';
@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private currentUser: User | null;
  private firestoreUser: FirestoreUser;

  // eslint-disable-next-line max-len
  constructor(public auth: Auth, public router: Router, public fireStorageService: FireStorageService,
              private firestore: Firestore, private errorService: ErrorService ) {
    this.auth.onAuthStateChanged(user => this.setCurrentUser(user));
  }

  ///moet dit hier doen vanwege circular dependency
  async updateUserEventsWithNewUserData(firestoreUser: FirestoreUser): Promise<void>{
    const results = await getDocs<Event>(
      query<Event>(
        this.getCollectionRef('events'),
        where('createdByUser.uid', '==', firestoreUser.uid),
      ));
    for (const result of results.docs.map(d => ({...d.data(), key: d.id}))){
      const id = result.key;
      const docRef = doc(this.getCollectionRef<Event>('events'), id);
      await updateDoc(docRef,{createdByUser: firestoreUser});
    }
  }
  async getUserFromFirestore(): Promise<void> {
    const results = await getDocs<FirestoreUser>(
      query<FirestoreUser>(
        this.getCollectionRef('users'),
        where('uid', '==', getAuth().currentUser.uid),
      )
    );

    const user: FirestoreUser = results.docs.map(d => ({...d.data(), key: d.id}))[0];
    console.log(user);
    //mocht de user toch niet geregistreerd staan in de firestore maar wel al zijn aangemaakt in
    //de authorization
    if (results.docs.map(d => ({...d.data(), key: d.id}))[0] === undefined){
      await this.createUserInFirestore('users', getAuth().currentUser);
    }
  }

  async createUserInFirestore(collectionName: string, user: User): Promise<void> {
    const newUser: FirestoreUser = {
      uid: user.uid,
      displayName: 'new user',
      email: user.email
    };
    await addDoc<FirestoreUser>(
      this.getCollectionRef<FirestoreUser>(collectionName),
      newUser
    );
  }
  searchUsers(email: string){

  }
   returnCurrentUser(){
    this.currentUser = getAuth().currentUser;
    return this.currentUser;
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

  async updateFirestoreProfile(field: string, value: string){
    const results = await getDocs<FirestoreUser>(
      query<FirestoreUser>(
        this.getCollectionRef('users'),
        where('uid', '==', this.currentUser.uid),
      ));
    const id = results.docs.map(d => ({...d.data(), key: d.id}))[0].key;
    let fireStoreUser: FirestoreUser = results.docs.map(d => ({...d.data(), key: d.id}))[0];
    const docRef = doc(this.getCollectionRef<FirestoreUser>('users'), id);
    if (field === 'display'){
      await setDoc<FirestoreUser>(
        docRef,{
          displayName: value, email: fireStoreUser.email, uid: fireStoreUser.uid
        }
      );
    }
    if (field === 'photo'){
      await setDoc<FirestoreUser>(
        docRef,{
          displayName: fireStoreUser.displayName, email: fireStoreUser.email, uid: fireStoreUser.uid, photoURL: value
        }
      );
    }

    if (field === 'email'){
      await setDoc<FirestoreUser>(
        docRef,{
          displayName: fireStoreUser.displayName, email: value, uid: fireStoreUser.uid
        }
      );
    }

    await getDoc(docRef).then((async newDoc => {
        fireStoreUser = newDoc.data();
        await this.updateUserEventsWithNewUserData(fireStoreUser);
      })
    );

  }

  async logIn(email: string, password: string): Promise<void>{
    this.currentUser = null;
      await signInWithEmailAndPassword(getAuth(), email, password).then(async (userCredential) => {
        await getAuth().updateCurrentUser(userCredential.user);
        await this.getUserFromFirestore();
      }).catch(() => {
        //max length es lint fout
        this.errorService.callErrorMessage
        ('Inloggen', '<p>* Wees er zeker van dat het email-adress en het wachtwoord correct zijn ingevuld!</p>');
      });

  }

  async createUser(email: string, password: string): Promise<void>
  {
    const auth: Auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user: User = userCredential.user;

        console.log(user);
        this.createUserInFirestore('users', user).then(() =>{
          console.log('done');
        });
      })
      .catch((error) => {
        const errorCode: string = error.code;
        const errorMessage: string = error.message;

        console.log('errors\n' + errorCode + '\n'+ errorMessage);
      });
  }



  async updateProfile(email: string, wachtwoord: string, displayName: string, foto: Photo){
    console.log(email + '\n' + wachtwoord + '\n' + displayName);
    if (email !== undefined){
      await updateEmail(this.currentUser, email);
      await this.updateFirestoreProfile('email', email);
    }
    if (wachtwoord !== undefined){
      await updatePassword(this.currentUser, wachtwoord);

    }

    if (displayName !== undefined){
      await updateProfile(this.auth.currentUser, {
        displayName
      });
      await this.updateFirestoreProfile('display', displayName);
    }

    if (foto !== undefined){
      const url: string = await this.fireStorageService.saveProfileImage(foto, this.currentUser);
      console.log(url + ' '+  foto);
      await updateProfile(this.auth.currentUser, {photoURL: url});
      this.currentUser = getAuth().currentUser;
      await this.updateFirestoreProfile('photo', url);
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

  private getCollectionRef<T>(collectionName: string): CollectionReference<T> {
    return collection(this.firestore, collectionName) as CollectionReference<T>;
  }
  private async setCurrentUser(user: User): Promise<void> {
    this.currentUser = user;
    if (this.currentUser) {
      await this.router.navigate(['/']);
    }
    else {
      this.currentUser = getAuth().currentUser;
      console.log(this.currentUser);
      await this.router.navigate(['/login-registration']);
    }
  }
}
