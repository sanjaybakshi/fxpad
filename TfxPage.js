import Tcanvas         from "./Tcanvas.js";
import TplaybackSlider from "./TplaybackSlider.js";

let fCanvas
let fPlaybackSlider

function init()
{
    fCanvas = new Tcanvas("fxCanvas")
    fPlaybackSlider = new TplaybackSlider("playBackCtrl", "playPauseBtn", "playSlider", fCanvas)


    

    // Try to lay out the controls.
    //

    console.log("window")
    console.log(window.innerWidth, window.innerHeight)

    fitToWindow()

    fCanvas.init()    

}

function fitToWindow()
{
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

    // get the height of the playblackslider
    //
    console.log(fPlaybackSlider._playBackCtrl)    
}

window.addEventListener("load", init);


window.addEventListener('resize', fitToWindow);

