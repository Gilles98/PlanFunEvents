import { Injectable } from '@angular/core';
import {AlertController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor( public alertController: AlertController) { }

  async callErrorMessage(title: string, error: string): Promise<void>
  {

    const alert = await this.alertController.create({
      header: title,
      subHeader: 'er is een fout gebeurt!',
      message:error,
      buttons: [{text: 'OK',
      handler: () =>{
        alert.dismiss();
      }
      }]
    });
   await alert.present();
  }
}
