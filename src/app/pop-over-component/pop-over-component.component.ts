import { Component, OnInit } from '@angular/core';
import {AuthorizationService} from '../authorizationService/authorization.service';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-pop-over-component',
  templateUrl: './pop-over-component.component.html',
  styleUrls: ['./pop-over-component.component.scss'],
})
export class PopOverComponentComponent implements OnInit {

  constructor(public authService: AuthorizationService,public popoverController: PopoverController) { }

  ngOnInit() {}

}
