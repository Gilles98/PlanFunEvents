import { Injectable } from '@angular/core';
import {Event} from '../Datatypes/Classes/Event';
import {
  addDoc,
  collection,
  CollectionReference,
  Firestore,
  getDocs,
  orderBy,
  query,
  where
} from '@angular/fire/firestore';
import FirestoreUser from '../Datatypes/Classes/FirestoreUser';
import {SendMessageService} from '../sendMessageService/send-message.service';
import IEvent from '../Datatypes/Interface/IEvent';
import {AuthorizationService} from '../authorizationService/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private firestore: Firestore, private messageService: SendMessageService, private authService: AuthorizationService) { }


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

  private getStandardMessage(): string{

    return 'dit is verzonden door de gebruiker met het geregistreerde mail adress: ' + this.authService.returnCurrentUser().email + '.\n' +
      'Dit kan dus betekenen dat dit verzonden is vanaf een ander account ' +
      'doordat de app gebruikmaakt van de geinstalleerde mail applicatie' +
      ' op het toestel waarmee dit verzonden is.';
  }

  private getCollectionRef<T>(collectionName: string): CollectionReference<T> {
    return collection(this.firestore, collectionName) as CollectionReference<T>;
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


}
