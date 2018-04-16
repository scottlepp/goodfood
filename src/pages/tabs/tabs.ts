import { Component } from '@angular/core';

import { ScanPage } from '../scan/scan';
import { ListPage } from '../list/list';
import { ItemPage } from '../item/item';

import { NavController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = ListPage;
  tab2Root: any = ScanPage;
  tab3Root: any = ItemPage;
  selected;
  
  constructor(public navCtrl: NavController, params: NavParams) {
    this.selected = params.data;
  }
  
}
