import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, PermissionStatus, Photo} from '@capacitor/camera';
import {Capacitor} from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  profileImage: Photo;
  private permissionGranted: PermissionStatus = {camera: 'granted', photos: 'granted'};
  constructor() {
    this.loadData();
  }

  async openPhotos(): Promise<void>{
    if ( !this.havePhotosPermission()) {
      await this.requestPermissions();
    }
    await this.getPhotoFromGallery();
  }

  async loadProfileImagePWA(): Promise<Photo>{
    return this.profileImage;
  }

  async getPhotoFromGallery(): Promise<void>{
  const result = await Camera.getPhoto({
    quality: 75,
    allowEditing: true,
    resultType: CameraResultType.Uri,
    source: CameraSource.Photos

  });
  console.log(result);
  this.profileImage = result;
}

  private async requestPermissions(): Promise<void> {
    try {
      this.permissionGranted = await Camera.requestPermissions({permissions: ['photos']});
    } catch (error) {
      console.error(`This device type doesn't support the usage of permissions: ${Capacitor.getPlatform()} platform.`);
    }
  }

  private async retrievePermissions(): Promise<void> {
    try {
      this.permissionGranted = await Camera.checkPermissions();
    } catch (error) {
      console.error(`This device type doesn't support the usage of permissions: ${Capacitor.getPlatform()} platform.`);
    }
  }



  private havePhotosPermission(): boolean {
    return this.permissionGranted.photos === 'granted';
  }

  private async loadData(): Promise<void> {
    await this.retrievePermissions();
  }

}
