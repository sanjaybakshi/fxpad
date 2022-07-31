import Ttool      from "./Ttool.js";
import Ttouch     from "./Ttouch.js";
import TdrawUtils from "./TdrawUtils.js";
import Tmath      from './Tmath.js'
import Trect      from './Trect.js'

import Ttoolbar_scissors from "./Ttoolbar_scissors.js";

import { fModel } from './Tmodel.js'



class Ttool_scissors extends Ttool
{
    
    constructor(canvas, toolButton)
    {
	super()

	this.fCanvas           = canvas
	this._toolButton       = toolButton

	this._posManipDefaultColor   = 'red'
	this._posManipColor          = this._posManipDefaultColor
	this._posManipMoveColor      = 'yellow'
	this._circleManipSize        = 10

	this._manipSizeW       = 10
	this._manipSizeH       = 5	
	this._xOffset          = 0
	this._yOffset	       = 0

	
	let bound_executeFunc = this.executeCut.bind(this)
	this._toolbar_scissors = new Ttoolbar_scissors("toolbar.scissorsId", null, bound_executeFunc)
	
	this._translateStarted = false
	this._horizontalMode   = true
	
	this._objRect = null
    }

    mouseDown(e)
    {
	super.mouseDown(e)

	if (this._objRect != null) {
	    
	    let touchInfo = Ttouch.getTouch(e)
	    
	    let x = touchInfo.x
	    let y = touchInfo.y

	    let vertTarget = Trect.constructFromCenterWidthHeight(this.verticalManipPosition(),
								  this._manipSizeW,
								  this._manipSizeH)
	    
		
	    if (TdrawUtils.isInsideCircle({x:x, y:y},
					  this.circleManipPosition(),
					  this._circleManipSize)) {
		this._posManipColor = this._posManipMoveColor
		this._translateStarted = true

		this._horizontalMode = true
		
	    } else if (vertTarget.isInside({x:x, y:y})) {
		this._posManipColor = this._posManipMoveColor
		this._translateStarted = true

		this._horizontalMode = false
	    }
	}
    }

    mouseMove(e)
    {
	super.mouseMove(e)	

	if (this._objRect != null) {

	    let touchInfo = Ttouch.getTouch(e)	    
	    let x = touchInfo.x
	    let y = touchInfo.y
	    
	    if (this._translateStarted) {

		if (this._horizontalMode) {
		    if (y < this._objRect._y1) {
			y = this._objRect._y1
		    } else if (y > this._objRect._y2) {
			y = this._objRect._y2
		    }
		    this._yOffset = y - this._objRect.center().y
		} else {
		    if (x < this._objRect._x1) {
			x = this._objRect._x1
		    } else if (x > this._objRect._x2) {
			x = this._objRect._x2
		    }
		    this._xOffset = x - this._objRect.center().x

		}
	    }
	}
    }
    
    
    mouseUp(e)
    {
	super.mouseUp(e)
	
	this._posManipColor    = this._posManipDefaultColor
	this._translateStarted = false

    }

    draw(ctx)
    {
	super.draw(ctx)

	if (this._objRect != null) {
	    
	    ctx.save()
		
	    // Draw a horizontal cut line.
	    //

	    if (this._horizontalMode == true) {
		ctx.beginPath()
		ctx.lineWidth = 2
		ctx.strokeStyle = 'purple'
	    
		ctx.beginPath()
		ctx.moveTo(this._objRect._x1, this._objRect.center().y + this._yOffset)
		ctx.lineTo(this._objRect._x2, this._objRect.center().y + this._yOffset)
		ctx.stroke()
	    } else {
		// Draw a vertical cut line.
		//
		ctx.beginPath()
		ctx.lineWidth = 1
		ctx.strokeStyle = 'purple'
		
		ctx.beginPath()
		ctx.moveTo(this._objRect.center().x + this._xOffset, this._objRect._y1)
		ctx.lineTo(this._objRect.center().x + this._xOffset, this._objRect._y2)
		ctx.stroke()
	    }

		
	    TdrawUtils.drawCircle(ctx, this.circleManipPosition(),
				  this._circleManipSize,
				  this._posManipColor,
				  "black", 1)
	    

	    
	    TdrawUtils.drawTriangle(ctx, this.verticalManipPosition(),
				    this._manipSizeW,
				    this._manipSizeH,
				    "south",
				    this._posManipColor,
				    "black", 1)

	    

	    // Draw a dashed line around the selected objects.
	    //
	    
	    this._objRect.drawDashed(ctx)
	    
	    //TdrawUtils.drawRect(ctx, this._objRect.center(), this._objRect.width(), this._objRect.height())

	    
	    ctx.restore()
	}
	
    }


    circleManipPosition()
    {
	return {x:this._objRect._x1,
		y:this._objRect.center().y + this._yOffset}
    }

    verticalManipPosition()
    {
	return {x: this._objRect.center().x + this._xOffset,
		y: this._objRect._y1 - this._manipSizeH}
    }
    
    dismiss()
    {
	super.dismiss()

	this._toolbar_scissors.hide()
	
	console.log("dismissing")

	this._objRect = null
	
    }

    engage()
    {
	super.engage()

	this.initFromSelection()
		
	let buttonPos = [this._toolButton.getBoundingClientRect().left,
			 this._toolButton.getBoundingClientRect().bottom]
	    
	this._toolbar_scissors.showAt(buttonPos)
    }

    hideToolbars()
    {
	super.hideToolbars()
	this._toolbar_scissors.hide()
    }

    executeCut()
    {

	console.log("let's cut it")

	let center = this._objRect.center()
	let yPos   = center.y + this._yOffset
	let xPos   = center.x + this._xOffset


	let newBoxes = []
	
	for (const obj of fModel.fSelectionList._sList) {

	    if (this._horizontalMode) {
		// Check to see if this box can be split by this yPos.
		//

		let r = Trect.constructFromCenterWidthHeight(obj.getCenterInPixels(),
							 obj.widthInPixels(),
							 obj.heightInPixels())
		if (r.isInside({x:obj.getCenterInPixels().x, y: yPos})) {
	    
		    let bxs = fModel.fBox2dWorld.scissors(obj, [yPos], [], this.fCanvas.getCurrentFrame())

		    for (const b of bxs) {
			newBoxes.push(b)
		    }
		}
	    } else {
		// Check to see if this box can be split by this xPos.
		//

		let r = Trect.constructFromCenterWidthHeight(obj.getCenterInPixels(),
							 obj.widthInPixels(),
							 obj.heightInPixels())
		if (r.isInside({x: xPos, y: obj.getCenterInPixels().y})) {
	    
		    let bxs = fModel.fBox2dWorld.scissors_horizontal(obj, [xPos], this.fCanvas.getCurrentFrame())

		    for (const b of bxs) {
			newBoxes.push(b)
		    }
		}
	    }
	}

	if (this._horizontalMode) {
	    for (const obj of fModel.fSelectionList._sList) {
		let r = Trect.constructFromCenterWidthHeight(obj.getCenterInPixels(),
							     obj.widthInPixels(),
							     obj.heightInPixels())
		if (r.isInside({x:obj.getCenterInPixels().x, y: yPos})) {
		    
		    fModel.fBox2dWorld.deleteBox(obj)
		}
	    }
	} else {
	    for (const obj of fModel.fSelectionList._sList) {
		let r = Trect.constructFromCenterWidthHeight(obj.getCenterInPixels(),
							     obj.widthInPixels(),
							     obj.heightInPixels())
		if (r.isInside({x: xPos, y: obj.getCenterInPixels().y})) {
		    console.log("delete")
		    fModel.fBox2dWorld.deleteBox(obj)
		}
	    }
	}
	    

	// Have to do this so the newly created boxed gets added to the simulation.
	// kind of a hack.
	//
	this.fCanvas.setFrame(this.fCanvas.getCurrentFrame())
		
	// Need to call this here (not right after creating it because it won't be fully
	// construcuted until setFrame is called.
	//	
	fModel.fSelectionList.replace(newBoxes)	


	this.initFromSelection()
    }


    initFromSelection()
    {
	this._objRect = null
	
	if (fModel.fSelectionList._sList.length > 0) {

	    let obj = fModel.fSelectionList._sList[0]

	    let center = obj.getCenterInPixels()
	    let width  = obj.widthInPixels()
	    let height = obj.heightInPixels()
	    
	    this._objRect = Trect.constructFromCenterWidthHeight(center,width,height)
	    
	    for (const obj of fModel.fSelectionList._sList) {
		let rect = Trect.constructFromCenterWidthHeight(obj.getCenterInPixels(),
								obj.widthInPixels(),
								obj.heightInPixels())
		
		this._objRect = this._objRect.union(rect)

	    }

	    this._yOffset = 0
	}
    }
    
}

export default Ttool_scissors
