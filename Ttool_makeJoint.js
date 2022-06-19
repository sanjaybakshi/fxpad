import Ttool   from "./Ttool.js";
import Ttouch  from "./Ttouch.js";

class Ttool_makeJoint extends Ttool
{
    
    constructor(canvas)
    {
	super()

	this.fCanvas = canvas

	this._box1          = null
	this._box2          = null
	this._strokeStarted = false

	this._box1Pos       = null
	this._box2Pos       = null

	this._mouseMovPos = null
    }

    draw(ctx)
    {
	super.draw(ctx)
	
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
    }
    mouseDown(e)
    {
	super.mouseDown(e)

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
    }

    mouseMove(e)
    {
	super.mouseMove(e)	

	    let touchInfo = Ttouch.getTouch(e)
	    
	    let x = touchInfo.x
	    let y = touchInfo.y

	    this._mouseMovPos = {x:x,y:y}
	
    }

    mouseUp(e)
    {
	super.mouseUp(e)

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
    }
}

export default Ttool_makeJoint
