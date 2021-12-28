import { Injectable } from '@angular/core';
import {Contact, Contacts} from '@capacitor-community/contacts';
import {PermissionStatus} from '@capacitor-community/contacts';
import {Camera} from '@capacitor/camera';
import {Capacitor} from '@capacitor/core';
import {isPlatform} from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  permission: PermissionStatus = {granted: true};
  constructor() {
  }


  async getAllContacts(): Promise<{ contacts: Contact[] } | null | undefined>{

    let cont;
    if (isPlatform('android')){
      const permission = await Contacts.getPermissions();
      if (!permission.granted){
        return undefined;
      }
      cont = Contacts.getContacts().then((data) => data);
      return cont;
    }


  }
  private async retrievePermissions(): Promise<void> {
    try {
      Contacts.getPermissions().then((permiss) =>{
        this.permission = permiss;
      });
    } catch (error) {
      console.error(`This device type doesn't support the usage of permissions: ${Capacitor.getPlatform()} platform.`);
    }
  }

  private havePermission(){
    return this.permission.granted === true;
  }

  private async loadData(){
    await this.retrievePermissions();

  }
}
