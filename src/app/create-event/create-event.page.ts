import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SelectDressCode} from '../Datatypes/SelectDresscodeEnum';
import {Event} from '../Datatypes/Classes/Event';
import {AuthorizationService} from '../authorizationService/authorization.service';
import Location from '../Datatypes/Classes/Location';
import {ModalController} from '@ionic/angular';
import {ContactModalComponent} from '../contact-modal/contact-modal.component';
import {Contact} from '@capacitor-community/contacts';
import {EventService} from '../eventService/event.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit {
  adress: string;
  city: string;
  title: string;
  contacts: Contact[];
  minimumDate: number = Date.now();
  ownLocationName: string;
  message: string;
  dresscodes: SelectDressCode[] = Object.values(SelectDressCode);
  selectedCode: SelectDressCode = this.dresscodes[0];
  selectedDate: string;
  constructor( private router: Router, private authService: AuthorizationService, public modalController: ModalController,
               private eventService: EventService) {
    console.log(this.dresscodes);
  }

  checkChanges(): boolean{

  if (this.adress === '' || this.city === '' || this.adress === '' || this.title === '' || this.message === ''|| this.contacts === undefined
  || this.contacts.length <= 0 || this.selectedDate === ''){
    return false;
  }
    return true;
  }

  async openContacts(){
    const modal = await this.modalController.create({
      component: ContactModalComponent,
    });
    modal.onDidDismiss().then((data => {
      console.log(data);
      this.contacts = data.data;
    }));
    return await modal.present();
  }

  async createEvent(): Promise<void>{
    if (this.checkChanges()){
      const location: Location = {city: this.city, adress: this.adress, ownName: this.ownLocationName};
      const event: Event = new Event({title: this.title, message: this.message, invitedUsersWithRegisterdMailAdress:[],
        createdByUser: await this.eventService.getFireStoreUser(this.authService.returnCurrentUser().uid)
      , location, dresscode: this.selectedCode, date: this.selectedDate});
      for (const user of this.contacts) {
          event.invitedUsersWithRegisterdMailAdress.push(user.emails[0]?.address);
      }
      await this.eventService.createEvent(event);
    }
  }
  ngOnInit() {
  }

}
