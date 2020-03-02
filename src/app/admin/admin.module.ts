import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { AdminRoutingModule } from './admin-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { HelperModule } from '../helper/helper.module';
import { AuthModule } from '../auth/auth.module';

import { MainService } from './main.service';
import { AlertService } from '../alert.service';
import { LayoutComponent } from './layout/layout.component';
import { TradeComponent } from './trade/trade.component';
import { UnitsComponent } from './units/units.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    HelperModule,
    FormsModule,
    ClarityModule,
    AuthModule
  ],
  declarations: [MainPageComponent, LayoutComponent, TradeComponent, UnitsComponent],
  providers: [
    MainService,
    AlertService
  ]
})
export class AdminModule { }
