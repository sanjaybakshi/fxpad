import Tcanvas         from "./Tcanvas.js";
import TplaybackSlider from "./TplaybackSlider.js";

let fCanvas
let fPlaybackSlider

function init()
{
    fCanvas = new Tcanvas("fxCanvas")
    fPlaybackSlider = new TplaybackSlider("playPauseBtn","playSlider",fCanvas)

    fCanvas.init()    
}


window.addEventListener("load", init);

