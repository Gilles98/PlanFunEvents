import { Injectable } from '@angular/core';
import {Contact, Contacts} from '@capacitor-community/contacts';
import {PermissionStatus} from '@capacitor-community/contacts';
import {Capacitor} from '@capacitor/core';
@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  constructor() {
  }


  async getAllContacts(): Promise<{ contacts: Contact[] } | null | undefined>{

    let cont;
    if (Capacitor.isNativePlatform()){
      const permission: PermissionStatus = await Contacts.getPermissions();
      if (!permission.granted){
        return undefined;
      }
      else {
        cont = Contacts.getContacts().then((data) => {
          data.contacts = data.contacts.filter(r => r.emails.length > 0);
          return data;
        });
      }
    }
    return cont;

  }
}
