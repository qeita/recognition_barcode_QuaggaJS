(() => {

  /**
   * reference:
   * https://ourcodeworld.com/articles/read/460/how-to-create-a-live-barcode-scanner-using-the-webcam-in-javascript
   */
  
  let _scannerIsRunning = false
  const outputTxt = document.querySelector('.output_txt')

  function startScanner(){
    Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: document.querySelector('#scanner-container'),
        constraints: {
          width: 480,
          height: 320,
          faceingMode: 'user'
        }
      },
      decoder: {
        readers: [
          'code_128_reader',
          'ean_reader',
          'ean_8_reader',
          'code_39_reader',
          'code_39_vin_reader',
          'codabar_reader',
          'upc_reader',
          'upc_e_reader',
          'i2of5_reader'
        ],
        debug: {
          showCanvas: true,
          showPatches: true,
          showFoundPatches: true,
          showSkelton: true,
          showLabels: true,
          showPatchLabels: true,
          showRemainingpatchLabels: true,
          boxFromPatches: {
            showTransformed: true,
            showTransformedBox: true,
            showBB: true
          }
        }
      }


    }, function(err){
      if(err){
        console.log(err)
        return
      }
      console.log('Initialization finished. Ready to start')
      let video = document.querySelector('video')
      video.setAttribute('playsinline', true)
      video.setAttribute('muted', true)
      video.setAttribute('controls', true)
      Quagga.start()

      _scannerIsRunning = true
    })

    Quagga.onProcessed( (result) => {
      let drawingCtx = Quagga.canvas.ctx.overlay
      drawingCanvas = Quagga.canvas.dom.overlay

      if(result){
        if(result.boxes){
          drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width')), parseInt(drawingCanvas.getAttribute('height')))
          result.boxes.filter( (box) => {
            return box !== result.box
          }).forEach( (box) => {
            Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: 'green', lineWidth: 2})
          })
        }

        if(result.box){
          Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: '#00f', lineWidth: 2})
        }
        if(result.codeResult && result.codeResult.code){
          Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3})
        }
      }
    })

    Quagga.onDetected( (result) => {
      console.log('Barcode detected and processed: [' + result.codeResult.code + ']', result)
      outputTxt.textContent('Barcode detected and processed: [' + result.codeResult.code + ']')
    })

  }


  document.getElementById('btn').addEventListener('click', () => {
    if(_scannerIsRunning){
      Quagga.stop()
    }else{
      startScanner()
    }
  }, false)



})()