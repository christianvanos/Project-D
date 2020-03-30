import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {LoginComponent} from './login.component';
import {LoginPageRoutingModule} from './login-routing.module';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LoginPageRoutingModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule {}
