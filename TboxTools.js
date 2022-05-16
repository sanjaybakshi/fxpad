import Ttouch	    from "./Ttouch.js";


class TboxTools
{
    _isMovingBoxTools = false
    _offsetInBoxTools = [0,0]

    
    constructor(boxToolsDocName, brushColorDocName, brushWidthBtn, brushWidthWnd, brushWidthSlider, canvas) {

	this._boxToolsCtrl      = document.getElementById(boxToolsDocName)
	this._boxToolsColorCtrl = document.getElementById(brushColorDocName)
	this._brushWidthBtn    = document.getElementById(brushWidthBtn)
	this._brushWidthWnd    = document.getElementById(brushWidthWnd)	
	this._brushWidthSlider = document.getElementById(brushWidthSlider)	

	this._canvas = canvas;
	
	this._boxToolsCtrl.addEventListener('mousedown', (e) => {
	    this.mouseDown(e)
	});
	
	this._boxToolsCtrl.addEventListener('touchstart', (e) => {
	    this.mouseDown(e)
	});

	this._boxToolsCtrl.addEventListener('mouseup', (e) => {
	    this.mouseUp(e)
	});

	this._boxToolsCtrl.addEventListener('touchend', (e) => {
	    this.mouseUp(e)
	});

	window.addEventListener('mousemove', (e) => {
	    this.mouseMove(e)
	});

	window.addEventListener('touchmove', (e) => {
	    this.mouseMove(e)
	});

	this._boxToolsColorCtrl.addEventListener('change', (e) => {
	    this.colorChanged(e)
	});

	this._brushWidthBtn.addEventListener('click', (e) => {
	    this.brushButtonClick(e)
	});

	this._brushWidthSlider.addEventListener('input', (e) => {
	    this.brushSliderChange(e)
	});
    }

    mouseDown(e)
    {
	let clientXY = Ttouch.getClientXY(e)

	const output = document.getElementById("DebugCtrl")
	//output.textContent = 'info2 = ' + x + ' ' + y

	this._isMovingBoxTools = true
	this._offsetInBoxTools = [this._boxToolsCtrl.offsetLeft - clientXY.x,
				 this._boxToolsCtrl.offsetTop  - clientXY.y]

    }

    mouseUp(e)
    {
	this._isMovingBoxTools = false;
    }

    mouseMove(e)
    {
	let clientXY = Ttouch.getClientXY(e)

	const output = document.getElementById("DebugCtrl")
	//output.textContent = 'mov =' + clientXY.x + ' ' + clientXY.y


	if (this._isMovingBoxTools) {

	    
	    this._boxToolsCtrl.style.left = (clientXY.x + this._offsetInBoxTools[0]) + 'px';
	    this._boxToolsCtrl.style.top  = (clientXY.y + this._offsetInBoxTools[1]) + 'px';	    
	    e.stopPropagation()
	}
    }

    colorChanged(e)
    {
	this._canvas.fCurrentStroke._color = e.target.value
    }

    brushButtonClick(e)
    {
	if (this._brushWidthWnd.style.display == "none" || this._brushWidthWnd.style.display == "") {
	    
	    this._brushWidthWnd.style.display = "grid";


	    // Get the center of the button.
	    //
	    let buttonRect = this._brushWidthBtn.getBoundingClientRect()
	    let buttonCenter = [buttonRect.left + buttonRect.width/2,
				buttonRect.top  + buttonRect.height/2]

	    
	    // Get the position of the boxTools window.
	    //
	    //let xOffset = this._boxToolsCtrl.offsetWidth
	    let boxToolsRect = this._boxToolsCtrl.getBoundingClientRect()
	    
	    //console.log(xOffset)
	    let clientXY = Ttouch.getClientXY(e)
	    //clientXY.x = clientXY.x + xOffset
	    
	    //this._brushWidthWnd.style.left = (clientXY.x + 'px');
	    this._brushWidthWnd.style.left = (boxToolsRect.right + 'px');
	    this._brushWidthWnd.style.top  = (buttonCenter[1] + 'px');

	} else {
	    this._brushWidthWnd.style.display = "none";
	}
    }

    brushSliderChange(e)
    {
	this._canvas.fCurrentStroke._brushWidth = e.target.value	
    }
    
}


export default TboxTools;
	
