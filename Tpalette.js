import Ttouch	    from "./Ttouch.js";


class Tpalette
{


    _isMovingPalette = false
    _offsetInPalette = [0,0]

    
    constructor(paletteDocName, brushColorDocName, canvas) {

	this._paletteCtrl      = document.getElementById(paletteDocName)
	this._paletteColorCtrl = document.getElementById(brushColorDocName)	

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
}


export default Tpalette;
	
