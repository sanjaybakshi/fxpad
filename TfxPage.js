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

    fCanvas.init()    
}

function fitToWindow()
{
    fCanvas.fCanvas.width  = fCanvas.fCanvas.offsetWidth;
    fCanvas.fCanvas.height = fCanvas.fCanvas.offsetHeight;

    fCanvas.fCanvas.style.width  = fCanvas.fCanvas.offsetWidth;
    fCanvas.fCanvas.style.height = fCanvas.fCanvas.offsetHeight;

    
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

