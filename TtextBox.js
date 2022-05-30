import Tdiv    from "./Tdiv.js";
import Ttouch  from "./Ttouch.js";


class TtextBox extends Tdiv
{
    _isMovingBoxTools = false
    _offsetInBoxTools = [0,0]

    
    constructor(textBoxId)
    {
	super(textBoxId)
	
	console.log("constructing textbox")
	
	this.hide()
	
	this._div.style.width = (200+'px')
    /*
	this._div.addEventListener('mousedown', (e) => {
	    this.mouseDown(e)
	});
	
	this._div.addEventListener('touchstart', (e) => {
	    this.mouseDown(e)
	});
	
	this._div.addEventListener('mouseup', (e) => {
	    this.mouseUp(e)
	});
	
	this._div.addEventListener('touchend', (e) => {
	    this.mouseUp(e)
	});
	
	window.addEventListener('mousemove', (e) => {
	    this.mouseMove(e)
	});
	
	window.addEventListener('touchmove', (e) => {
	    this.mouseMove(e)
	});
*/
    }

    
    mouseDown(e)
    {
	let clientXY = Ttouch.getClientXY(e)
	
	const output = document.getElementById("DebugCtrl")
	//output.textContent = 'info2 = ' + x + ' ' + y
	
	this._isMovingBoxTools = true
	this._offsetInBoxTools = [this._div.offsetLeft - clientXY.x,
				  this._div.offsetTop  - clientXY.y]	
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

	    
	    this._div.style.left = (clientXY.x + this._offsetInBoxTools[0]) + 'px';
	    this._div.style.top  = (clientXY.y + this._offsetInBoxTools[1]) + 'px';	    
	    e.stopPropagation()
	}
    }

}


export default TtextBox
	
