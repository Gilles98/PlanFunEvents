import { Component, OnInit } from '@angular/core';
import {Contact} from '@capacitor-community/contacts';
import {AuthorizationService} from '../authorizationService/authorization.service';
import {ContactsService} from '../contactsService/contacts.service';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss'],
})
export class ContactModalComponent implements OnInit {

  contacts: Promise<{ contacts: Contact[] }>;
  returnContacts: Contact[] = [];
  verticalFabPosition = 'bottom';
  constructor(public authorizationService: AuthorizationService, public contactService: ContactsService,
              private modalController: ModalController) {
    this.contacts = contactService.getAllContacts();
    console.log(this.contacts);
  }

  checkChanges(contact: Contact){
    this.returnContacts.push(contact);
  }

  sendBack(){
    this.modalController.dismiss(this.returnContacts);
  }
  ngOnInit() {}

}
