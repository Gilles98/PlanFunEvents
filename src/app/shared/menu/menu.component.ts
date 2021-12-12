import { Component, OnInit } from '@angular/core';
import {MenuController, PopoverController} from '@ionic/angular';
import {AuthorizationService} from '../../authorizationService/authorization.service';
import {PopOverComponentComponent} from '../../pop-over-component/pop-over-component.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  popOverDismiss;
  constructor(private menu: MenuController, public popoverController: PopoverController, public authService: AuthorizationService) { }

  ngOnInit() {}
  async dismissPopover(){
    await this.popoverController.dismiss();
  }

  toggleMenu(){
    this.menu.toggle();
  }
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopOverComponentComponent,

      event: ev,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
