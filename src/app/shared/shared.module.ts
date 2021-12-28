import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenuComponent} from './menu/menu.component';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {FooterComponent} from './footer/footer.component';



@NgModule({
    declarations: [MenuComponent, FooterComponent],
    exports: [MenuComponent, FooterComponent],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule
    ]
})
export class SharedModule { }
