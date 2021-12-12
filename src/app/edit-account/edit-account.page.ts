import { Component, OnInit } from '@angular/core';
import {AuthorizationService} from '../authorizationService/authorization.service';
import {PhotoService} from '../photoService/photo.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.page.html',
  styleUrls: ['./edit-account.page.scss'],
})
export class EditAccountPage implements OnInit {

  constructor(public authorizationService: AuthorizationService, public photoService: PhotoService) { }

  ngOnInit() {
  }

}
