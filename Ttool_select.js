import Ttool  from "./Ttool.js";
import Ttouch from "./Ttouch.js";

import { fModel } from './Tmodel.js'


class Ttool_select extends Ttool
{
    
    constructor(canvas, toolButton)
    {
	super()

	this.fCanvas = canvas
	this._toolButton = toolButton
	
	this._posA          = null
	this._posB          = null
	this._strokeStarted = false
    }

    draw(ctx)
    {
	super.draw(ctx)
	    
	if (this._strokeStarted == true) {

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
	super.mouseUp(e)

	let touchInfo = Ttouch.getTouch(e)

	let x = touchInfo.x
	let y = touchInfo.y
	
	this._posB = {x: x, y: y}
	
	this._strokeStarted = false
	this._box1 = null
	this._box2 = null
	
	let boxes = fModel.fBox2dWorld.intersectRect(this._posA.x, this._posA.y,
						     this._posB.x, this._posB.y)
	
	fModel.fSelectionList.replace(boxes)
    }
}

export default Ttool_select
