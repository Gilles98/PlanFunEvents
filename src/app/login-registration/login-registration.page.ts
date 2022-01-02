import { Component, OnInit } from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {NavController} from '@ionic/angular';
import {HomePage} from '../home/home.page';
import {Router} from '@angular/router';
import {AuthorizationService} from '../authorizationService/authorization.service';
import {ErrorService} from '../ErrorService/error.service';

@Component({
  selector: 'app-login-registration',
  templateUrl: './login-registration.page.html',
  styleUrls: ['./login-registration.page.scss'],
})
export class LoginRegistrationPage implements OnInit {

  //moet type weghalen vanwegen es lint dat fout gaf toen ik het wou initializeren zodat er
  //string methodes kunnen gebruikt worden bij controle op validatie
  registratieMail = '';
  registratieWachtwoord = '';
  isNative = Capacitor.isNativePlatform();

  inloggenMail: string;
  inloggenWachtwoord: string;
  constructor(private authorizationService: AuthorizationService, private errorService: ErrorService) { }

  ngOnInit() {
  }

  checkChanges(input: string){
    console.log(input);
  }

  async handleLogin(): Promise<void> {
    await this.authorizationService.logIn(this.inloggenMail, this.inloggenWachtwoord)
  }
  async handleRegistration(): Promise<void>{
    let isValide = true;
    let message = '';
    if (!this.registratieMail.includes('@')){
      console.log('- ongeldige mail');
      message += '<p>* Er moet een @ aanwezig zijn in het email-adress</p>';
      isValide = false;
    }
    if (this.registratieWachtwoord.length < 8)
    {
      console.log('wachtwoord te kort');
      message += '<p>* Het wachtwoord moet minstens 8 tekens bevatten</p>';
      isValide = false;
    }
    if (isValide){
     await this.authorizationService.createUser(this.registratieMail, this.registratieWachtwoord);
    }
    else {
     await this.errorService.callErrorMessage('Registreren', message);
    }
  }

}
