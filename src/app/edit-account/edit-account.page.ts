import { Component, OnInit } from '@angular/core';
import {AuthorizationService} from '../authorizationService/authorization.service';
import {PhotoService} from '../photoService/photo.service';
import {Photo} from '@capacitor/camera';
import {DomSanitizer} from '@angular/platform-browser';
import {FireStorageService} from '../fireStorageService/fire-storage.service';
import {AlertController} from '@ionic/angular';
import {promise} from 'protractor';
import {addWarning} from '@angular-devkit/build-angular/src/utils/webpack-diagnostics';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.page.html',
  styleUrls: ['./edit-account.page.scss'],
})
export class EditAccountPage implements OnInit {

  image: Photo;
  isNewPhotoSelected = false;
  // eslint-disable-next-line max-len
  standardImage: string;
  telefoonNummer: string;
  wachtwoord: string;
  displayName: string;
  email: string;
  constructor(public authorizationService: AuthorizationService, public photoService: PhotoService, public domSanitizer: DomSanitizer,
              public firebaseStorageService: FireStorageService, private alertController: AlertController) {
    this.configurePicture();
    // eslint-disable-next-line max-len
    this.standardImage = 'https://media-exp1.licdn.com/dms/image/C4E03AQHoFg4CPOMm5A/profile-displayphoto-shrink_400_400/0/1619005080746?e=1643846400&v=beta&t=srBKZNLYPn0G-qJmcezz5O9OeF9HRRzmI6D5jf6FMHU';
  }
  async saveChanges(){
    console.log(this.image);
    await this.authorizationService.updateProfile(this.email, this.wachtwoord, this.displayName, this.image).then(async () => {
      this.isNewPhotoSelected = false;
      await this.showMessageToHome();
    });
  }

  async showMessageToHome(): Promise<void>{
    const alert = await this.alertController.create({
      header: ('Genoteerd!'),
      subHeader: 'U wordt gestuurd naar de home pagina',
      buttons: [{text: 'OK',
        handler: () =>{
          alert.dismiss();
        }
      }]
    });
    await alert.present();
  }

   async selectPhoto(): Promise<void> {
     await this.photoService.openPhotos().then(() =>{
       this.configurePicture();
       this.isNewPhotoSelected = true;
     } );
   }

  async configurePicture(): Promise<void>{
    this.image = await this.photoService.loadProfileImage();
}

  ngOnInit() {
    this.configurePicture();
  }

}
