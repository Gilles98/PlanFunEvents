import { Component, OnInit } from '@angular/core';
import {AuthorizationService} from '../authorizationService/authorization.service';
import {PhotoService} from '../photoService/photo.service';
import {Photo} from '@capacitor/camera';
import {DomSanitizer} from '@angular/platform-browser';
import {FireStorageService} from '../fireStorageService/fire-storage.service';

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
              public firebaseStorageService: FireStorageService) {


    this.configurePicture();
    // eslint-disable-next-line max-len
    this.standardImage = 'https://media-exp1.licdn.com/dms/image/C4E03AQHoFg4CPOMm5A/profile-displayphoto-shrink_400_400/0/1619005080746?e=1643846400&v=beta&t=srBKZNLYPn0G-qJmcezz5O9OeF9HRRzmI6D5jf6FMHU';
  }
  async saveChanges(){
    await this.authorizationService.updateProfile(this.email, this.wachtwoord, this.displayName, this.image).then(() =>{
      this.isNewPhotoSelected = false;
    });
  }

   async selectPhoto(): Promise<void> {
     await this.photoService.openPhotos().then(() =>{
       this.configurePicture();
       this.isNewPhotoSelected = true;
     } );
   }

  async configurePicture(): Promise<void>{
    this.image = await this.photoService.loadProfileImagePWA();
}

  ngOnInit() {
    this.configurePicture();
  }

}
