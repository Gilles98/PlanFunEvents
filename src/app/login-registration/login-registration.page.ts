import { Component, OnInit } from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {NavController} from '@ionic/angular';
import {HomePage} from '../home/home.page';
import {Router} from '@angular/router';
import {AuthorizationService} from '../authorizationService/authorization.service';

@Component({
  selector: 'app-login-registration',
  templateUrl: './login-registration.page.html',
  styleUrls: ['./login-registration.page.scss'],
})
export class LoginRegistrationPage implements OnInit {

  registratieMail: string;
  registratieWachtwoord: string;
  registratieTelefoon: string;
  isNative = Capacitor.isNativePlatform();

  inloggenMail: string;
  inloggenWachtwoord: string;
  constructor(private authorizationService: AuthorizationService, private navController: NavController) { }

  ngOnInit() {
  }

  checkChanges(input: string){
    console.log(input);
  }

  handleLogin(): void{
      this.authorizationService.logIn(this.inloggenMail, this.inloggenWachtwoord);
  }

  handleRegistration(): void{
    let isValide = true;
    if (!this.registratieMail.includes('@')){
      console.log('ongeldige mail');
      isValide = false;
    }
    if (this.registratieWachtwoord.length < 8)
    {
      console.log('wachtwoord te kort');
      isValide = false;
    }
    if (isValide){
      this.authorizationService.createUser(this.registratieMail, this.registratieWachtwoord);
    }
  }

}
