import Tdiv         from "./Tdiv.js";
import TdrawUtils   from "./TdrawUtils.js";
import Ttouch       from "./Ttouch.js";

class Ttoolbar_objects extends Tdiv
{

    kDrawBox     = 0
    kDrawCircle  = 1
    kDrawJoint   = 2
    
    constructor(toolbar_objectsId, canvas)
    {
	super(toolbar_objectsId)

	this._drawBoxCtrl    = document.getElementById("drawBoxId")
	this._drawCircleCtrl = document.getElementById("drawCircleId")
	this._drawJointCtrl  = document.getElementById("drawJointId")
	
	
	this.fCanvas = canvas

	this._box1          = null
	this._box2          = null
	this._strokeStarted = false

	this._box1Pos       = null
	this._box2Pos       = null
	
	this._mouseMovPos = null
	this.hide()	


	this._drawBoxCtrl.addEventListener('click', (e) => {
	    this.toolChange(e)
	});
	this._drawCircleCtrl.addEventListener('click', (e) => {
	    this.toolChange(e)
	});
	this._drawJointCtrl.addEventListener('click', (e) => {
	    this.toolChange(e)
	});

	this._toolMode = this.kDrawBox;
	this._drawBoxCtrl.style.backgroundColor    = "darkgray";
    }

    toolChange(e)
    {
	console.log("tool change")

	if (e.target.id == "drawBoxId") {
	    this._drawBoxCtrl.style.backgroundColor    = "darkgray";
	    this._drawCircleCtrl.style.backgroundColor = "gainsboro";
	    this._drawJointCtrl.style.backgroundColor  = "gainsboro";

	    this._toolMode = this.kDrawBox	    
	} else if (e.target.id == "drawCircleId") {
	    this._drawBoxCtrl.style.backgroundColor    = "gainsboro";
	    this._drawCircleCtrl.style.backgroundColor = "darkgray";
	    this._drawJointCtrl.style.backgroundColor  = "gainsboro";

	    this._toolMode = this.kDrawCircle
	} else if (e.target.id == "drawJointId") {
	    this._drawBoxCtrl.style.backgroundColor    = "gainsboro";
	    this._drawCircleCtrl.style.backgroundColor = "gainsboro";
	    this._drawJointCtrl.style.backgroundColor  = "darkgray";

	    this._toolMode = this.kDrawJoint	    
	}

	e.stopPropagation()
    }
    
    hide()
    {
	super.hide()
    }


    draw(ctx)
    {
	if (this._toolMode == this.kDrawJoint) {
	
	    if (this._strokeStarted == true) {

		if (this._box1 != null) {
		    //let center = this._box1.getCenterInPixels()

		    let center = this._box1Pos
		    
		    ctx.lineWidth = 1.5;
		    
		    ctx.strokeStyle = 'red';
		    ctx.beginPath();
		    ctx.moveTo(center.x, center.y);
		    ctx.lineTo(this._mouseMovPos.x, this._mouseMovPos.y)
		    ctx.stroke();	
		}
	    }
	    return true
	}

	return false
    }

    mouseDown(e)
    {
	if (this._toolMode == this.kDrawJoint) {

	    let touchInfo = Ttouch.getTouch(e)

	    let x = touchInfo.x
	    let y = touchInfo.y
	    
	    let b = this.fCanvas._box2dWorld.intersects([x,y])
	
	    if (b != null) {
		// starting to make a joint.
		//
		this._box1 = b
		this._box1Pos = {x:x,y:y}
		
		this._strokeStarted = true
	    }
	    
	    return true;
	}

	return false
    }
    mouseMove(e)
    {
	if (this._toolMode == this.kDrawJoint) {

	    let touchInfo = Ttouch.getTouch(e)
	    
	    let x = touchInfo.x
	    let y = touchInfo.y

	    this._mouseMovPos = {x:x,y:y}
	    
	    return true;
	}

	return false
    }
    
    mouseUp(e)
    {
	if (this._toolMode == this.kDrawJoint) {

	    let touchInfo = Ttouch.getTouch(e)
	    
	    let x = touchInfo.x
	    let y = touchInfo.y
	    
	    let b = this.fCanvas._box2dWorld.intersects([x,y])
	    
	    if (b != null && b != this._box1) {
		// starting to make a joint.
		//
		this._box2 = b
		this._box2Pos = {x:x, y:y}
		
		// Construct a joint.
		//
		let cf = this.fCanvas.getCurrentFrame()
		this.fCanvas._box2dWorld.addJoint(this._box1, this._box1Pos,
						  this._box2, this._box2Pos,
						  cf)

		// Hack to refresh. Need a better mechanism.
		//
		if (this.fCanvas._pauseAnim) {
		    this.fCanvas.setFrame(this.fCanvas._currentFrame)
		    console.log("doing the joint")
		    
		}
	    }


	    this._strokeStarted = false
	    this._box1 = null
	    this._box2 = null
	    
	    return true;
	}

	return false
    }

}


export default Ttoolbar_objects
