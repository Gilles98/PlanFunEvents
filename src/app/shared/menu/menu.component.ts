import { Component, OnInit } from '@angular/core';
import {MenuController, PopoverController} from '@ionic/angular';
import {AuthorizationService} from '../../authorizationService/authorization.service';
import {PopOverComponentComponent} from '../../pop-over-component/pop-over-component.component';
import {User} from 'firebase/auth';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  popOverDismiss;
  user: User;
  constructor(private menu: MenuController, public popoverController: PopoverController, public authService: AuthorizationService) {
    this.user = authService.returnCurrentUser();
  }

  ngOnInit() {}
  async dismissPopover(){
    await this.popoverController.dismiss();
  }
  async presentPopover(ev: Event) {
    const popover: HTMLIonPopoverElement = await this.popoverController.create({
      component: PopOverComponentComponent,
      event: ev,
    });
    await popover.present();
    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
