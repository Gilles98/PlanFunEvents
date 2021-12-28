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
  events: Event[];
  contacts: Promise<{ contacts: Contact[] }>;
  constructor(public authorizationService: AuthorizationService, public contactService: ContactsService,
              public eventService: EventService) {

    console.log(this.authorizationService.returnCurrentUser().email);

  }
  ngOnInit() {
  }

  ionViewWillEnter(){
    this.eventService.getInvitedEventsByCurrentUserId(this.authorizationService.returnCurrentUser().email)
      .then((e =>{this.events = e;
        console.log(this.events);}));

  }

  ngOnDestroy() {
    this.events = [];
  }


}
