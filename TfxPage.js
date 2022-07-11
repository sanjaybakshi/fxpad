import Tcanvas         from "./Tcanvas.js";
import TplaybackSlider from "./TplaybackSlider.js";
import Tpalette        from "./Tpalette.js";



let fCanvas
let fPlaybackSlider
let fPalette



function init()
{
    fCanvas         = new Tcanvas("fxCanvas")
    fPlaybackSlider = new TplaybackSlider("playPauseBtn", "playSlider", "playFrameNumber", fCanvas)
    fPalette        = new Tpalette("palette", "brushColor", "brushWidthBtn", "brushWidthWindow", "brushWidthSlider", fCanvas)

    
    

    // Try to lay out the controls.
    //

    fitToWindow()
}

function fitToWindow()
{
    var w = fCanvas.fCanvas.offsetWidth
    var h = fCanvas.fCanvas.offsetHeight
    console.log(w,h)
    
    fCanvas.fCanvas.style.width  = w + "px";
    fCanvas.fCanvas.style.height = h + "px";

    var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    //scale = 1
    fCanvas.fCanvas.width  = Math.floor(w * scale);
    fCanvas.fCanvas.height = Math.floor(h * scale);

    fCanvas.init()    
    
/*
    let pbsHeight = fPlaybackSlider._playBackCtrl.clientHeight
    console.log(pbsHeight)
    
    fCanvas.fCanvas.width  = window.innerWidth
    fCanvas.fCanvas.height = window.innerHeight - pbsHeight

    let x_pos  = 10
    let y_pos  = window.innerHeight - pbsHeight
    let sWidth = window.innerWidth -x_pos*2

    fPlaybackSlider._playBackCtrl.style.width    = sWidth+'px';
    fPlaybackSlider._playBackCtrl.style.position = "absolute";
    fPlaybackSlider._playBackCtrl.style.left     = x_pos+'px';
    fPlaybackSlider._playBackCtrl.style.top      = y_pos+'px';
*/
    // get the height of the playblackslider
    //
    //console.log(fPlaybackSlider._playBackCtrl)
}

//window.onload = init
window.addEventListener("load", init);


//window.addEventListener('resize', fitToWindow);

