import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

@IonicPage({
  name: 'items',
  segment: 'items'
})
@Component({
  templateUrl: 'list.html'
})
export class ListPage {

  items;

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private navParams: NavParams) {
  }
  
  ionViewWillEnter() {
    this.storage.get('gfs-recent').then(items => {
      if (items !== null && items !== undefined) {
        this.items = items;
      }
    });
  }

  select(item) {
    this.navParams.data.selected = item.itemCode;
    this.navCtrl.parent.select(2);
  }
}
