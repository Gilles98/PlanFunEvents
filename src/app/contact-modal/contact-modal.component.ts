import {Component, Input, OnInit} from '@angular/core';
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
  completedContactsLoading = false;
  constructor(public authorizationService: AuthorizationService,
              private modalController: ModalController, private contactService:  ContactsService) {
  }


  checkChanges(contact: Contact): void{
    this.returnContacts.push(contact);
  }

  async sendBack(): Promise<void>{
    await this.modalController.dismiss(this.returnContacts);
  }

  //voor mocht de gebruiker toch een wijziging maken
  async loadContacts(): Promise<void>{
    this.contacts = this.contactService.getAllContacts();
    console.log(this.contacts);
  }
  ngOnInit() {
    this.loadContacts().then(() => this.completedContactsLoading = true);
  }

}
