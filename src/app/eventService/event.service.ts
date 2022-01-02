import { Injectable } from '@angular/core';
import {Event} from '../Datatypes/Classes/Event';
import {
  addDoc,
  collection,
  CollectionReference, doc,
  Firestore,
  getDocs,
  query, updateDoc,
  where
} from '@angular/fire/firestore';
import FirestoreUser from '../Datatypes/Classes/FirestoreUser';
import {SendMessageService} from '../sendMessageService/send-message.service';
import {AuthorizationService} from '../authorizationService/authorization.service';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private firestore: Firestore, private messageService: SendMessageService, private authService: AuthorizationService) { }

  async updateFirestoreEventToAccepted(event: Event){
    const results = await getDocs<Event>(
      query<Event>(
        this.getCollectionRef('events'),
        where('date',  '==', event.date),
        where('invitedUsersWithRegisterdMailAdress', '==', event.invitedUsersWithRegisterdMailAdress),
        where('createdByUser.uid', '==', event.createdByUser.uid)
      ),);
    const id = results.docs.map(d => ({...d.data(), key: d.id}))[0].key;
    const docRef = doc(this.getCollectionRef<Event>('events'), id);
   await updateDoc(docRef,{confirmedUsers: event.confirmedUsers});
  }

  async updateFirestoreEventToNotAcceptedAndRemoveInvite(event: Event, mail: string){
    const results = await getDocs<Event>(
      query<Event>(
        this.getCollectionRef('events'),
        where('date',  '==', event.date),
        where('invitedUsersWithRegisterdMailAdress', 'array-contains',mail),
        where('createdByUser.uid', '==', event.createdByUser.uid)
      ),);
    const id = results.docs.map(d => ({...d.data(), key: d.id}))[0].key;
    const docRef = doc(this.getCollectionRef<Event>('events'), id);
    await updateDoc(docRef,{confirmedUsers: event.confirmedUsers, invitedUsersWithRegisterdMailAdress:
      event.invitedUsersWithRegisterdMailAdress});
  }

  async createEvent(event: Event): Promise<void>{
    const data: Event = event;
    console.log(data);
    console.log(event);
    await addDoc<Event>(
      this.getCollectionRef<Event>('events'),
      JSON.parse(JSON.stringify(data))
    ).then(() =>{
      this.messageService.sendMail(event.invitedUsersWithRegisterdMailAdress, 'uitnodiging voor '+ event.title,
        event.message + '\n DISCLAIMER\n' + this.getStandardMessage());
      this.messageService.sendMoreOptions(event.message, event.title);
    });


  }





  async getFireStoreUser(uid: string): Promise<FirestoreUser>{
    const results = await getDocs<FirestoreUser>(
      query<FirestoreUser>(
        this.getCollectionRef('users'),
        where('uid', '==', uid),
      ));
    const fireStoreUser: FirestoreUser = results.docs.map(d => ({...d.data(), key: d.id}))[0];
    console.log(fireStoreUser);
    return fireStoreUser;
  }

  async getInvitedEventsByCurrentUserId(email: string): Promise<Event[]>{
    const results = await getDocs<Event>(
      query<Event>(
        this.getCollectionRef('events'),
        where('invitedUsersWithRegisterdMailAdress', 'array-contains', email)
      ));
      console.log(results.docs.map(d => ({...d.data(), key: d.id})));
      return results.docs.map(d => ({...d.data(), key: d.id}));
}

  private getStandardMessage(): string{
    return 'Het email adress waarmee dit verzonden is kan verschillen met die geregistreerd in je contactenlijst van save2date' +
      'Dit kan dus betekenen dat dit verzonden is vanaf een ander account ' +
      'Dit is namelijk doordat de app gebruikmaakt van de geinstalleerde mail applicatie' +
      'op het toestel waarmee dit verzonden is.';
  }

  private getCollectionRef<T>(collectionName: string): CollectionReference<T> {
    return collection(this.firestore, collectionName) as CollectionReference<T>;
  }


}
