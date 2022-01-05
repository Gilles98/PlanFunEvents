import { Component, OnInit } from '@angular/core';
import {AuthorizationService} from '../authorizationService/authorization.service';
import {PhotoService} from '../photoService/photo.service';
import {Photo} from '@capacitor/camera';
import {FireStorageService} from '../fireStorageService/fire-storage.service';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.page.html',
  styleUrls: ['./edit-account.page.scss'],
})
export class EditAccountPage implements OnInit {

  image: Photo;
  isNewPhotoSelected = false;
  standardImage: string;
  password: string;
  displayName: string;
  email: string;
  constructor(public authorizationService: AuthorizationService, public photoService: PhotoService,
              public firebaseStorageService: FireStorageService, private alertController: AlertController) {
    // eslint-disable-next-line max-len
    this.standardImage = 'https://www.clker.com/cliparts/i/P/o/p/y/t/gray-silhouette-of-a-man-hi.png';
  }
  async saveChanges(){
    console.log(this.image);
    await this.showMessageToHome();
    await this.authorizationService.updateProfile(this.email, this.password, this.displayName, this.image).then(async () => {
      this.isNewPhotoSelected = false;
    });
  }

  async showMessageToHome(): Promise<void>{
    const alert: HTMLIonAlertElement = await this.alertController.create({
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

  ngOnInit(): void {
  }
  ionViewWillEnter(): void{
    this.configurePicture();
  }

  ionViewDidLeave(): void {
    this.image = undefined;
    this.isNewPhotoSelected = false;
    this.displayName = '';
    this.password = '';
    this.email =  '';
  }

}
