import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { LoadingController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@IonicPage({
  name: 'item',
  segment: 'item/:itemId'
})
@Component({
  selector: 'page-item',
  templateUrl: 'item.html'
})
export class ItemPage {

  itemId: string;
  product = {};
  Object = Object;
  categories = {};

  constructor(public navCtrl: NavController,
    private toast: ToastController,
    private dataService: DataServiceProvider,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private navParams: NavParams,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private alertCtrl: AlertController
  ) {
    }

  ionViewDidLoad() {
    this.fetch();
  }

  ionViewWillEnter() {
    this.product = {};
    this.fetch();
  }

  onItemChange() {
    this.product = {};
  }

  ionViewDidLeave() {
    this.product = {};
  }

  fetch() {
    const params = this.navParams.data;
    const item = params.selected || this.dataService.selected || params.itemId;
    if (item !== undefined) {
      this.itemId = item;
      this.dataService.selected = undefined;
      this.navParams.data.selected = undefined;
      this.fetchNutrition();
    }
  }

  fetchNutrition() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    const timeout = setTimeout(() => {
      loader.present();
    }, 500);

    this.dataService.fetchProduct(this.itemId).subscribe(items => {
      clearTimeout(timeout);
      if (items.length > 0) {
        this.product = items[0];
        this.categories = this.buildCategories(items[0]);
        this.store();
        loader.dismiss();
      } else {
        loader.dismiss();
        const toast = this.toast.create({message: 'Product not found!', duration: 5000});
        toast.present();
      }
    });
  }

  share() {
    var msg = 'Nutrition for: ' + this.itemId;
    const host = 'http://scottlepp.github.io/goodfood/';

    if (this.platform.is('cordova')) {
      this.socialSharing.share(msg, null, null, host + '#/item/' + this.itemId);
    } else {
      // Web Share API is only supported in Chrome Android
      const nav:any = window.navigator;
      if (nav.share) {
        nav.share({
            title: 'Nutritionist',
            text: msg,
            url: host + '#/item/' + this.itemId,
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      } else {
        // TODO
        // hide the share button during load?
        let alert = this.alertCtrl.create({
          title: 'Not Supported',
          subTitle: 'Sorry. Sharing is not supported on your device',
          buttons: ['Dismiss']
        });
        alert.present();
      }
    }
    
  }

  private store() {
    this.storage.get('gfs-recent').then((val) => {
      if (val === null || val === undefined) {
        val = [];
      }
      if (val.findIndex(item => item.itemCode === this.itemId) === -1) {
        val.push(this.product);
      }
      this.storage.set('gfs-recent', val);
    });
  }

  private buildCategories(item) {
    const categories = {};
    for (const key in item) {
      const words = key    // insert a space before all caps
        .replace(/([A-Z])/g, ' $1')
        // uppercase the first character
        .replace(/^./, function(str){ return str.toUpperCase(); })
      const wordArr = words.split(' ');
      const categoryName = wordArr[0];
      let category:Array<any> = categories[categoryName];
      if (category === undefined) {
        category = [];
      }
      wordArr.splice(0, 1); // strip the category name
      const categoryItem = {name: wordArr.join(' '), value: item[key]};
      category.push(categoryItem);
      categories[categoryName] = category;
    }
    return categories;
  }

}
