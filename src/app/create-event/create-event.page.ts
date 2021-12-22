import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SelectDressCode} from '../Datatypes/SelectDresscodeEnum';
import {Event} from '../Datatypes/Classes/Event';
import {AuthorizationService} from '../authorizationService/authorization.service';
import Location from '../Datatypes/Classes/Location';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit {
  adress: string;
  city: string;
  title: string;
  ownLocationName: string;
  message: string;
  dresscodes: SelectDressCode[] = Object.values(SelectDressCode);//[SelectDressCode.code1, SelectDressCode.code2, SelectDressCode.code3, SelectDressCode.code4];
  selectedCode: SelectDressCode = this.dresscodes[0];
  constructor( private router: Router, private authService: AuthorizationService) {
    console.log(this.dresscodes);
  }

  checkChanges(): boolean{

  if (this.adress === '' || this.city === '' || this.adress === '' || this.title === '' || this.message === ''){
    return false;
  }
    return true;
  }

  async createEvent(): Promise<void>{
    if (this.checkChanges()){
      const location: Location = {city: this.city, adress: this.adress, ownName: this.ownLocationName};
      const event: Event = new Event({title: this.title, message: this.message,
        createdByUser: this.authService.returnCurrentUser().uid
      , location, dresscode: this.selectedCode});
      console.log(event);
    }
  }
  ngOnInit() {
  }

}
