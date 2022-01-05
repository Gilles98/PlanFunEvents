import { Injectable } from '@angular/core';
import { ref, uploadString, StringFormat, FirebaseStorage } from 'firebase/storage';
import {FirebaseApp} from '@angular/fire/app';
import {getDownloadURL, getStorage} from '@angular/fire/storage';
import {AuthorizationService} from '../authorizationService/authorization.service';
import {User} from 'firebase/auth';
import {Photo} from '@capacitor/camera';
import {updateProfile} from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class FireStorageService {

  user: User;
  private readonly storage: FirebaseStorage;
  constructor(private app: FirebaseApp) {
    this.storage = getStorage(app);
  }

  async saveProfileImage(foto: Photo, user: User): Promise<string>{
    //Krijg hier het type StorageReference niet op toegevoegd
    const imgRef =  ref(this.storage, user.uid + '.png');

    await uploadString(imgRef, foto.dataUrl, StringFormat.DATA_URL);
    const url: string = await getDownloadURL(imgRef);
    return url;
  }
}
