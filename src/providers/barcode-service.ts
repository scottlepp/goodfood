import Quagga from 'quagga';
import { Subject } from 'rxjs/Subject';

export default class BarcodeService {
  subject:Subject<any>;

  public start() {
    this.subject = new Subject();
    Quagga.init({
      inputStream : {
          name : "Live",
          type : "LiveStream",
          constraints: {
            width:  window.innerWidth,
            height: window.innerHeight,
            facingMode: "environment"
          },
          area: {
             top: "0%",
             right: "0%",
             left: "0%",
             bottom: "0%"
         },
         // Or '#yourElement' (optional)
        target: document.querySelector('#scanner')
      },
      locator: {
        patchSize: "medium",
        halfSample: true
      },
      numOfWorkers: (navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4),
      decoder : {
       //Change Reader for the right Codes
      //  readers: [ "code_128_reader",
      //             "ean_reader",
      //             "ean_8_reader",
      //             "code_39_reader",
      //             "code_39_vin_reader",
      //             "codabar_reader",
      //             "upc_reader",
      //             "upc_e_reader",
      //             "i2of5_reader" ],
      readers: ['upc_reader']
      },
      locate: true
    }, function(err) {
        if (err) {
            console.log(err);
            return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    });
    // Make sure, QuaggaJS draws frames an lines around possible
     // barcodes on the live stream
     Quagga.onProcessed(function(result) {
         var drawingCtx = Quagga.canvas.ctx.overlay,
             drawingCanvas = Quagga.canvas.dom.overlay;

         if (result) {
             if (result.boxes) {
                 drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                 result.boxes.filter(function (box) {
                     return box !== result.box;
                 }).forEach(function (box) {
                     Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                 });
             }

             if (result.box) {
                 Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
             }

             if (result.codeResult && result.codeResult.code) {
                 Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
             }
         }
     });
   // Once a barcode had been read successfully, stop quagga and
   // close the modal after a second to let the user notice where
   // the barcode had actually been found.
   Quagga.onDetected( (result) => {
     if (result.codeResult.code){
      Quagga.stop();
      this.subject.next({item: result.codeResult.code})
     }
   });

   return this.subject;
  }

  public stop() {
    Quagga.stop();
  }
}