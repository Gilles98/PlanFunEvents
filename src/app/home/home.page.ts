import { Component } from '@angular/core';
import {AuthorizationService} from '../authorizationService/authorization.service';
import {Contact, Contacts} from '@capacitor-community/contacts';
import {ContactsService} from '../contactsService/contacts.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  contacts: Promise<{ contacts: Contact[] }>;
  constructor(public authorizationService: AuthorizationService, public contactService: ContactsService) {
  this.contacts = contactService.getAllContacts();
  }

}
