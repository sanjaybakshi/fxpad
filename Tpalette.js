import Ttouch	    from "./Ttouch.js";


class Tpalette
{


    _isMovingPalette = false
    _offsetInPalette = [0,0]

    
    constructor(paletteDocName, brushColorDocName, brushWidthBtn, brushWidthWnd, brushWidthSlider, canvas) {

	this._paletteCtrl      = document.getElementById(paletteDocName)
	this._paletteColorCtrl = document.getElementById(brushColorDocName)
	this._brushWidthBtn    = document.getElementById(brushWidthBtn)
	this._brushWidthWnd    = document.getElementById(brushWidthWnd)	
	this._brushWidthSlider = document.getElementById(brushWidthSlider)	

	this._canvas = canvas;
	
	this._paletteCtrl.addEventListener('mousedown', (e) => {
	    this.mouseDown(e)
	});
	
	this._paletteCtrl.addEventListener('touchstart', (e) => {
	    this.mouseDown(e)
	});

	this._paletteCtrl.addEventListener('mouseup', (e) => {
	    this.mouseUp(e)
	});

	this._paletteCtrl.addEventListener('touchend', (e) => {
	    this.mouseUp(e)
	});

	window.addEventListener('mousemove', (e) => {
	    this.mouseMove(e)
	});

	window.addEventListener('touchmove', (e) => {
	    this.mouseMove(e)
	});

	this._paletteColorCtrl.addEventListener('change', (e) => {
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

	this._isMovingPalette = true
	this._offsetInPalette = [this._paletteCtrl.offsetLeft - clientXY.x,
				 this._paletteCtrl.offsetTop  - clientXY.y]

    }

    mouseUp(e)
    {
	this._isMovingPalette = false;
    }

    mouseMove(e)
    {
	let clientXY = Ttouch.getClientXY(e)

	const output = document.getElementById("DebugCtrl")
	//output.textContent = 'mov =' + clientXY.x + ' ' + clientXY.y


	if (this._isMovingPalette) {

	    
	    this._paletteCtrl.style.left = (clientXY.x + this._offsetInPalette[0]) + 'px';
	    this._paletteCtrl.style.top  = (clientXY.y + this._offsetInPalette[1]) + 'px';	    
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

	    
	    // Get the position of the palette window.
	    //
	    //let xOffset = this._paletteCtrl.offsetWidth
	    let paletteRect = this._paletteCtrl.getBoundingClientRect()
	    
	    //console.log(xOffset)
	    let clientXY = Ttouch.getClientXY(e)
	    //clientXY.x = clientXY.x + xOffset
	    
	    //this._brushWidthWnd.style.left = (clientXY.x + 'px');
	    this._brushWidthWnd.style.left = (paletteRect.right + 'px');
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


export default Tpalette;
	
