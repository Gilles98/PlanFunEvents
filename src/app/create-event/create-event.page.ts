import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MapComponent} from '../map/map.component';
import {NominatimService} from '../NominatimService/nominatim.service';
import {NominatimResponse} from '../shared/models/nominatimResponse';
import {Router} from '@angular/router';
@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit {
  adress: string;
  city: string;
  constructor( private router: Router) {
  }

  checkChanges(){
    console.log(this.adress);
  }
  ngOnInit() {
  }

}
