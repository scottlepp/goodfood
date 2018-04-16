import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { ScanPage } from '../pages/scan/scan';
import { TabsPage } from '../pages/tabs/tabs';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { DataServiceProvider } from '../providers/data-service/data-service';
import { IonicStorageModule } from '@ionic/storage';
import { ItemPageModule } from '../pages/item/item.module';
import { ListPageModule } from '../pages/list/list.module';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BarcodeService } from '../providers/barcode-service';
import { HttpClientJsonpModule } from '@angular/common/http';

@NgModule({
  declarations: [
    MyApp,
    ScanPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    ItemPageModule,
    ListPageModule,
    HttpClientJsonpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ScanPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    Toast,
    DataServiceProvider,
    SocialSharing,
    BarcodeService
  ]
})
export class AppModule {}
