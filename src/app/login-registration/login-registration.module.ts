import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginRegistrationPageRoutingModule } from './login-registration-routing.module';

import { LoginRegistrationPage } from './login-registration.page';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LoginRegistrationPageRoutingModule
  ],
  declarations: [LoginRegistrationPage]
})
export class LoginRegistrationPageModule {}
