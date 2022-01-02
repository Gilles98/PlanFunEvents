import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthorizationService} from '../authorizationService/authorization.service';
import {Contact, Contacts} from '@capacitor-community/contacts';
import {ContactsService} from '../contactsService/contacts.service';
import {EventService} from '../eventService/event.service';
import {Event} from '../Datatypes/Classes/Event';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy{
  events: Event[] = [];
  contacts: Promise<{ contacts: Contact[] }>;
  constructor(public authorizationService: AuthorizationService, public contactService: ContactsService,
              public eventService: EventService, ) {

    console.log(this.authorizationService.returnCurrentUser().email);

  }
  ngOnInit() {
  }



  ionViewWillEnter(): void{
    this.eventService.getInvitedEventsByCurrentUserId(this.authorizationService.returnCurrentUser().email)
      .then((e =>{this.events = e;
        console.log(this.events);}));

  }
  async acceptInvite(event: Event): Promise<void>{

    const acceptedUserMail: string = event.invitedUsersWithRegisterdMailAdress.find((e => e ===
      this.authorizationService.returnCurrentUser().email));
    console.log(event.confirmedUsers.indexOf(''+event.confirmedUsers.includes(acceptedUserMail)));
    if (!event.confirmedUsers.includes(acceptedUserMail)){
      event.confirmedUsers.push(acceptedUserMail);
      console.log(event.confirmedUsers);
      await this.eventService.updateFirestoreEventToAccepted(event);
    }
  }

  async deleteInvite(event: Event): Promise<void>{

    const deleteUserMail: string = event.invitedUsersWithRegisterdMailAdress.find((e => e ===
      this.authorizationService.returnCurrentUser().email));
      console.log(event.confirmedUsers);

      event.invitedUsersWithRegisterdMailAdress = event.invitedUsersWithRegisterdMailAdress.filter(m => m !== deleteUserMail);
      console.log(event.invitedUsersWithRegisterdMailAdress);
      this.events = this.events.filter(e => e !== event);
      event.confirmedUsers = event.confirmedUsers.filter(r => r !== deleteUserMail);
      console.log(event.confirmedUsers);
      await this.eventService.updateFirestoreEventToNotAcceptedAndRemoveInvite(event, deleteUserMail);

  }

  ngOnDestroy(): void {
    this.events = [];
  }


}
