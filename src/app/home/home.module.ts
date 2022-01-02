import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {SharedModule} from '../shared/shared.module';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    SharedModule,
    FormsModule,
    LeafletModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
