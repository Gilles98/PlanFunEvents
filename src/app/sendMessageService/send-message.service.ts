import { Injectable } from '@angular/core';
import {EmailComposer} from 'capacitor-email-composer';

import { Share } from '@capacitor/share';
@Injectable({
  providedIn: 'root'
})
export class SendMessageService {

  constructor() { }

  async sendMail(sendTo: string[], subject: string, body: string){

    //op dit moment ondersteund de hasAccount functie enkel nog maar IOS
    //als deze ook android ondersteunde had er hier een if statement gestaan om te controleren
    //deze lijn en de log is gewoon om aan te tonen dat het bestaat
   const check = await EmailComposer.hasAccount();
   console.log(''+ check + sendTo);

   await EmailComposer.open({to: sendTo, subject, body});
  }


  //in de sms plugin zit nog een bug daarom toch gekozen om share als extra alternatief te gebruiken ter notificatie enkel
  //registreerd geen users bij een event
  async sendMoreOptions(body: string, subject: string){
    await Share.share({
      title: subject,
      text: body,
      dialogTitle: 'Extra invitatie manier',
    });
  }

}
