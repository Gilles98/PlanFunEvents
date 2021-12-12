import { Component } from '@angular/core';
import {FirebaseApp} from '@angular/fire/app';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(firebaseApp: FirebaseApp) {}
}
