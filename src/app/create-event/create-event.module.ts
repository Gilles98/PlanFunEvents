import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import { IonicModule } from '@ionic/angular';

import { CreateEventPageRoutingModule } from './create-event-routing.module';

import { CreateEventPage } from './create-event.page';
import {MapComponent} from '../map/map.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {ContactModalComponent} from '../contact-modal/contact-modal.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CreateEventPageRoutingModule,
    LeafletModule
  ],
  declarations: [CreateEventPage, MapComponent, ContactModalComponent]
})
export class CreateEventPageModule {}
