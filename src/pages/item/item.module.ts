import { NgModule } from '@angular/core';
import {IonicPageModule} from 'ionic-angular';

import { ItemPage } from './item';

@NgModule({
  declarations: [
    ItemPage
  ],
  imports: [
    IonicPageModule.forChild(ItemPage)
  ],
  entryComponents: [
    ItemPage
  ]
})
export class ItemPageModule {}