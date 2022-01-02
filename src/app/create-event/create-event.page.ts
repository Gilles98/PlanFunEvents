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
import {Capacitor} from '@capacitor/core';
import {ErrorService} from '../ErrorService/error.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit {

  //door es lint moest ik het string type weghalen bij sommige properties
  //ik heb dit zo gedaan hier omdat ik een hele lange if statement wil voorkomen
  //als de velden tijdens het opslagen worden gechecked
  //anders moest ik zowel op een lege string als undefined checken
  adress = '';
  city = '';
  title = '';
  contacts: Contact[];
  ownLocationName = '';
  message = '';
  minDate: string = new Date(Date.now()).toISOString();
  dresscodes: SelectDressCode[] = Object.values(SelectDressCode);
  selectedCode: SelectDressCode = this.dresscodes[0];
  selectedDate = '';
  constructor( private router: Router, private authService: AuthorizationService, public modalController: ModalController,
               private eventService: EventService, private errorService: ErrorService) {
    console.log(this.dresscodes);

    console.log(this.minDate);
  }
  isNative(): boolean{
    return Capacitor.isNativePlatform();
  }
  async checkChanges(): Promise<boolean> {
    if (this.adress ===  '' || this.adress === '' || this.title === '' || this.message === ''
      || this.contacts === undefined || this.contacts.length <= 0 || this.selectedDate === '') {
      await this.errorService.callErrorMessage('Events', '<p>* Wees er zeker van dat alle velden met een sterretje ' +
        'correct zijn ingevuld');
      return false;
    }
    return true;
  }

  async openContacts(): Promise<void>{
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: ContactModalComponent,
    });
    modal.onDidDismiss().then((data => {
      console.log(data);
      this.contacts = data.data;
    }));
       await modal.present();
  }

  async createEvent(): Promise<void>{
    if (await this.checkChanges()){
      const location: Location = {city: this.city, adress: this.adress, ownName: this.ownLocationName};
      const event: Event = new Event({title: this.title, message: this.message, invitedUsersWithRegisterdMailAdress:[],
        createdByUser: await this.eventService.getFireStoreUser(this.authService.returnCurrentUser().uid)
      , location, dresscode: this.selectedCode, date: this.selectedDate, confirmedUsers: []});
      for (const user of this.contacts) {
          event.invitedUsersWithRegisterdMailAdress.push(user.emails[0]?.address);
      }
      await this.eventService.createEvent(event);
    }
  }
  ngOnInit() {
  }

}
