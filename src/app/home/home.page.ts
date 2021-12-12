import { Component } from '@angular/core';
import {AuthorizationService} from '../authorizationService/authorization.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public authorizationService: AuthorizationService) {}

}
