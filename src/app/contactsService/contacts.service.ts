import { Injectable } from '@angular/core';
import {Contact, Contacts} from '@capacitor-community/contacts';
import {PermissionStatus} from '@capacitor-community/contacts';
import {Capacitor} from '@capacitor/core';
@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  permission: PermissionStatus = {granted: true};
  constructor() {
  }


  async getAllContacts(): Promise<{ contacts: Contact[] } | null | undefined>{

    let cont;
    if (Capacitor.isNativePlatform()){
      const permission = await Contacts.getPermissions();
      if (!permission.granted){
        return undefined;
      }
    }

    // eslint-disable-next-line prefer-const
    cont = Contacts.getContacts().then((data) => {
      data.contacts = data.contacts.filter(r => r.emails.length > 0);
      return data;
    });
    return cont;

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
}
