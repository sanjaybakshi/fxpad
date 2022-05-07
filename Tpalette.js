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

	this._paletteCtrl.addEventListener('mouseup', (e) => {
	    this.mouseUp(e)
	});

	window.addEventListener('mousemove', (e) => {
	    this.mouseMove(e)
	});

	this._paletteColorCtrl.addEventListener('change', (e) => {
	    this.colorChanged(e)
	});
	
	console.log("in the constructor for palette")
    }

    mouseDown(e)
    {
	let touchInfo = Ttouch.getTouch(e)

	let x = touchInfo.x
	let y = touchInfo.y

	console.log(x,y)
	const output = document.getElementById("output")
	output.textContent = 'info2 = ' + x + ' ' + y

	this._isMovingPalette = true
	this._offsetInPalette = [this._paletteCtrl.offsetLeft - e.clientX,
				 this._paletteCtrl.offsetTop  - e.clientY]

    }

    mouseUp(e)
    {
	this._isMovingPalette = false;
    }

    mouseMove(e)
    {
	if (this._isMovingPalette) {

	    this._paletteCtrl.style.left = (e.clientX + this._offsetInPalette[0]) + 'px';
	    this._paletteCtrl.style.top  = (e.clientY + this._offsetInPalette[1]) + 'px';	    
	    e.stopPropagation()
	}
    }

    colorChanged(e)
    {
	console.log('color');
	console.log(e.target.value)
	this._canvas.fCurrentStroke._color = e.target.value
    }
}


export default Tpalette;
	
