import Tcanvas         from "./Tcanvas.js";
import TplaybackSlider from "./TplaybackSlider.js";

let fCanvas
let fPlaybackSlider

function init()
{

    let canvas = document.getElementById("fxCanvas")
    console.log("canvas:")
    console.log(canvas.offsetWidth, canvas.offsetHeight);

    
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
    fCanvas.fCanvas.width  = fCanvas.fCanvas.offsetWidth;
    fCanvas.fCanvas.height = fCanvas.fCanvas.offsetHeight;
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
    console.log("fanvas:")
    console.log(fCanvas.fCanvas.width, fCanvas.fCanvas.height);
 
}

//window.onload = init
window.addEventListener("load", init);


//window.addEventListener('resize', fitToWindow);

