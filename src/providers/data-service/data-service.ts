import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataServiceProvider {

  public selected: string;

  productMap = {
      '93901100122': '100129',
      '939011001228': '100129',
      '93901165992': '115250',
      '93901430021': '143002',
      '93901600509': '600504',
      '93901806963': '806961',
      '93901768940': '176894',
      '50000811717': '111899',
      '93901757500': '175750',
      '93901411549': '411542',
      '93901698254': '698250'
  }

  constructor(public http: HttpClient) {}

  getProducts(){
    return this.http.get('assets/data/products.json');
  }

  fetchProductByBarcode(barcode:string) {
    barcode = barcode.slice(0, -1);
    const productId = this.productMap[barcode];
    return this.fetchProduct(productId);
  }

  fetchProduct(item: string): Observable<any[]>{
    // CORS issue here (probably) when running from gh pages
    
    // const service = '/nutrition';
    // let params = new HttpParams();
    // params = params.append('offeringGroupId', '00001');
    // params = params.append('languageTypeCode', 'en');
    // params = params.append('offeringId', item);

    // return this.http.get<Array<any>>(service,  { params: params })

    // using proxy setup on aws to get around CORS
    // https://github.com/Glifery/cors-proxy
    const service = 'https://api.gfs.com/ordering/rest/nutritionService/getNutritionInfo';
    const apiURL = `${service}?offeringGroupId=00001&languageTypeCode=en&offeringId=${item}`;
    const proxy = 'https://hep7f335fe.execute-api.us-east-2.amazonaws.com/dev/?url=';

    const proxied = proxy + encodeURIComponent(apiURL);
    return this.http.get<Array<any>>(proxied);

  }

}
