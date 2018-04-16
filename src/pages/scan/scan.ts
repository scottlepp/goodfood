import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ToastController } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { BarcodeService} from '../../providers/barcode-service';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html'
})
export class ScanPage {

  products: any[] = [];
  selectedProduct: any;
  scanning = false;

  constructor(public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private toast: ToastController,
    public dataService: DataServiceProvider,
    private navParams: NavParams,
    private barcodeService: BarcodeService,
    private platform: Platform) {}

  scan() {
    this.selectedProduct = {};
    if (this.platform.is('cordova')) {
      this.barcodeScanner.scan().then((barcodeData) => {
        this.fetch(barcodeData.text);
      }, (err) => {
        const toast = this.toast.create({message: err, duration: 5000});
        toast.present();
      });
    } else {
      const scanSubject = this.barcodeService.start();
      this.scanning = true;
      const subscription = scanSubject.subscribe(result => {
        this.scanning = false;
        subscription.unsubscribe();
        this.fetch(result.item);
      });
    }
  }

  fetch(barcode) {
    this.dataService.fetchProductByBarcode(barcode).subscribe(products => {
      if (products.length > 0) {
        // const toast = this.toast.create({message: 'Product found: ' + products[0].itemCode, duration: 5000});
        // toast.present();
        this.navParams.data.selected = products[0].itemCode;
        this.dataService.selected = products[0].itemCode;
        this.navCtrl.parent.select(2);
      } else {
        const toast = this.toast.create({message: 'Product not found: ' + barcode, duration: 5000});
        toast.present();
      }
    }, error => {
      const toast = this.toast.create({message: 'Product call failed', duration: 5000});
      toast.present();
    });
  }
}
