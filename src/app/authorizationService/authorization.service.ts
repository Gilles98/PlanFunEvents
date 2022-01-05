import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,User } from 'firebase/auth';
import {
  collection,
  CollectionReference,
  Firestore,
  doc,
  addDoc, getDocs, query, where, getDoc, setDoc, updateDoc
} from '@angular/fire/firestore';
// eslint-disable-next-line max-len
import {
  Auth, sendPasswordResetEmail,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile
} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {Photo} from '@capacitor/camera';
import {FireStorageService} from '../fireStorageService/fire-storage.service';
import FirestoreUser from '../Datatypes/Classes/FirestoreUser';
import {Event} from '../Datatypes/Classes/Event';
import {ErrorService} from '../ErrorService/error.service';
@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private currentUser: User | null;

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
    //heel uitzonderlijk als er iets fout gaat
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
          displayName: value, email: fireStoreUser.email, uid: fireStoreUser.uid, photoURL: fireStoreUser.photoURL
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
          displayName: fireStoreUser.displayName, email: value, uid: fireStoreUser.uid, photoURL: fireStoreUser.photoURL
        }
      );
    }

    await getDoc(docRef).then((async newDoc => {
        fireStoreUser = newDoc.data();
        console.log(fireStoreUser);
        await this.updateUserEventsWithNewUserData(fireStoreUser);
      })
    ).catch(err => {
      this.errorService.callErrorMessage('Update mislukt', err.message);
    });

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

  async resetPassword(email: string){
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
         console.log('kijk in mail');
         //uitzonderlijk error service oproepen voor een bevestiging ipv een error
      })
      .catch((error) => {
        const errorMessage = error.message;

        this.errorService.callErrorMessage('error bij wijzigen', errorMessage);
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
      console.log(foto);
      const url: string = await this.fireStorageService.saveProfileImage(foto, this.currentUser);
      console.log(url + ' '+  foto);
      await updateProfile(this.auth.currentUser, {photoURL: url});
      this.currentUser = getAuth().currentUser;
      await this.updateFirestoreProfile('photo', this.currentUser.photoURL);
    }
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
      await this.router.navigate(['/login-registration']);
    }
  }
}
