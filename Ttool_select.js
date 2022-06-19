import Ttool  from "./Ttool.js";
import Ttouch from "./Ttouch.js";


class Ttool_select extends Ttool
{
    
    constructor(canvas)
    {
	super()

	this.fCanvas = canvas

	this._posA          = null
	this._posB          = null
	this._strokeStarted = false
    }

    draw(ctx)
    {
	super.draw(ctx)
	    
	if (this._strokeStarted == true) {
	    //console.log("in draw")

	    ctx.lineWidth = 1.5;
	    ctx.strokeStyle = 'red';
	    
	    //let width  = Math.abs(this._posB.x - this._posA.x)
	    //let height = Math.abs(this._posB.y - this._posA.y)
	    let width  = (this._posB.x - this._posA.x)
	    let height = (this._posB.y - this._posA.y)
	    
	    ctx.beginPath();
	    ctx.moveTo(this._posA.x,         this._posA.y);
	    ctx.lineTo(this._posA.x + width, this._posA.y)
	    ctx.lineTo(this._posA.x + width, this._posA.y + height)
	    ctx.lineTo(this._posA.x,         this._posA.y + height)
	    ctx.lineTo(this._posA.x,         this._posA.y)		
	    ctx.stroke();	
	    
	}
    }
    mouseDown(e)
    {
	console.log("select-mouseDown")
	super.mouseDown(e)

	let touchInfo = Ttouch.getTouch(e)

	let x = touchInfo.x
	let y = touchInfo.y

	this._posA = {x: x, y: y}
	this._strokeStarted = true

    }

    mouseMove(e)
    {
	super.mouseMove(e)	

	let touchInfo = Ttouch.getTouch(e)
	
	let x = touchInfo.x
	let y = touchInfo.y
	
	this._posB = {x: x, y: y}	
    }

    mouseUp(e)
    {
	console.log("select->mouseUp")
	console.log(e.target)
	super.mouseUp(e)

	let touchInfo = Ttouch.getTouch(e)

	let x = touchInfo.x
	let y = touchInfo.y
	
	this._posB = {x: x, y: y}
	
	this._strokeStarted = false
	this._box1 = null
	this._box2 = null
	
	let boxes = this.fCanvas._box2dWorld.intersectRect(this._posA.x, this._posA.y,
							       this._posB.x, this._posB.y)
	console.log("num boxes: " + boxes.length)
	console.log(boxes)
	
	this.fCanvas._selectionList.replace(boxes)
    }
}

export default Ttool_select
