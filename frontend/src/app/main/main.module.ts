import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {MainPageRoutingModule} from './main-routing.module';
import {MainComponent} from './main.component';
import {FolderPageModule} from '../folder/folder.module';




@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MainPageRoutingModule,
        FolderPageModule
    ],
    declarations: [MainComponent]
})
export class MainModule {}
