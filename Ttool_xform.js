import Ttool      from "./Ttool.js";
import Ttouch     from "./Ttouch.js";
import TdrawUtils from "./TdrawUtils.js";
import Tmath      from './Tmath.js'

import { fModel } from './Tmodel.js'


class Ttool_xform extends Ttool
{
    
    constructor(canvas, toolButton)
    {
	super()

	this.fCanvas           = canvas
	this._toolButton       = toolButton
	
	this._boxManipSize     = 20

	this._boxManipDefColor  = 'red'
	this._boxManipMoveColor = 'yellow'

	this._boxManipColor    = this._boxManipDefColor

	this._scaleManipColor  = 'purple'
	this._scaleManipSize   = 20
	this._scaleManipOffset = 50
	this._translateStarted = false
	this._scaleStarted  = false

	this._mouseDownPos = {x:0, y:0}
	this._widthStart  = 0
	this._heightStart = 0
	
	this._scaleManipTarget_1 = {x:-this._scaleManipOffset,y:  this._scaleManipOffset}
	this._scaleManipTarget_2 = {x: this._scaleManipOffset,y: -this._scaleManipOffset}
    }

    mouseDown(e)
    {
	super.mouseDown(e)

	if (fModel.fSelectionList._sList.length > 0) {
	    let obj = fModel.fSelectionList._sList[0]

	    let center = obj.getCenterInPixels()
	
	    let touchInfo = Ttouch.getTouch(e)
	    
	    let x = touchInfo.x
	    let y = touchInfo.y

	    this._mouseDownPos = {x: x, y: y}

	    this._widthStart  = obj.widthInPixels()
	    this._heightStart = obj.heightInPixels()
	    
	    if (TdrawUtils.isInsideRect({x:x,y:y}, center, this._boxManipSize, this._boxManipSize)) {
		this._boxManipColor = this._boxManipMoveColor
		this._translateStarted = true
	    } else {

		let scalePos1 = {x: center.x + this._scaleManipTarget_1.x,
				 y: center.y + this._scaleManipTarget_1.y}	    
		if (TdrawUtils.isInsideRect({x:x,y:y}, scalePos1, this._scaleManipSize, this._scaleManipSize)) {
		    this._scaleStarted = true
		    console.log("hit")
		}
	    }
	}
    }

    mouseMove(e)
    {
	super.mouseMove(e)	
	
	if (fModel.fSelectionList._sList.length > 0) {
	    let obj = fModel.fSelectionList._sList[0]	    
	    let center = obj.getCenterInPixels()	    
	    let touchInfo = Ttouch.getTouch(e)	    
	    let x = touchInfo.x
	    let y = touchInfo.y
	    
	    if (this._translateStarted) {
		obj.setPosition({x:x,y:y})
	    } else if (this._scaleStarted) {

		let scaleVec = {x: x - this._mouseDownPos.x,
				y: y - this._mouseDownPos.y}

		let scaleAmt = Math.sqrt(scaleVec.x*scaleVec.x + scaleVec.y*scaleVec.y)
		if (scaleVec.x > 0) {
		    scaleAmt = Tmath.remap(0, 100, 1, 0.01, scaleAmt)

		} else {
		    scaleAmt = Tmath.remap(0, 100, 1, 10, scaleAmt)
		}

		console.log("scaling... " + scaleAmt)

		let w = this._widthStart  * scaleAmt
		let h = this._heightStart * scaleAmt

		obj.resize(w, h)
		
	    }
	}
    }
    
    
    mouseUp(e)
    {
	super.mouseUp(e)
	
	this._boxManipColor = this._boxManipDefColor
	this._translateStarted = false
	this._scaleStarted = false
    }

    draw(ctx)
    {
	super.draw(ctx)

	if (fModel.fSelectionList._sList.length > 0) {
	    let obj = fModel.fSelectionList._sList[0]

	    let center = obj.getCenterInPixels()
	    
	    ctx.lineWidth = 1.5;

	    ctx.strokeStyle = 'blue';
	    ctx.beginPath();
	    ctx.moveTo(center.x, center.y);
	    ctx.lineTo(center.x + 100, center.y)
	    ctx.stroke();	

	    ctx.strokeStyle = 'green';
	    ctx.beginPath();
	    ctx.moveTo(center.x, center.y);
	    ctx.lineTo(center.x, center.y - 100)
	    ctx.stroke();

	    TdrawUtils.fillRect(ctx, center, this._boxManipSize, this._boxManipSize, this._boxManipColor)


	    let scalePos1 = {x: center.x + this._scaleManipTarget_1.x,
			     y: center.y + this._scaleManipTarget_1.y}	    
	    TdrawUtils.fillRect(ctx, scalePos1, this._scaleManipSize, this._scaleManipSize, this._scaleManipColor)

	    let scalePos2 = {x: center.x + this._scaleManipTarget_2.x,
			     y: center.y + this._scaleManipTarget_2.y}	    
	    TdrawUtils.fillRect(ctx, scalePos2, this._scaleManipSize, this._scaleManipSize, this._scaleManipColor)
	    
	}
	
    }
    
}

export default Ttool_xform
