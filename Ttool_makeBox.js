import Ttool   from "./Ttool.js";
import Ttouch  from "./Ttouch.js";
import Tstroke from "./Tstroke.js";


class Ttool_makeBox extends Ttool
{
    constructor(canvas)
    {
	super()
	this.fCanvas = canvas
	this._strokeStarted = false
	this.fCurrentStroke = new Tstroke()	
    }

    draw(ctx)
    {
	super.draw(ctx)

	if (this._strokeStarted) {
	    this.fCurrentStroke.draw(ctx)
	}	
    }
    
    mouseDown(e)
    {
	super.mouseDown(e)

	console.log("moudeDown")
	
	let touchInfo = Ttouch.getTouch(e)
	
	let x = touchInfo.x
	let y = touchInfo.y

	this._strokeStarted = true

	this.fCurrentStroke.pushStrokePt({x:x,y:y}, touchInfo.pressure)
    }

    mouseMove(e)
    {
	super.mouseMove(e)

	if (this._strokeStarted) {
	
	    let touchInfo = Ttouch.getTouch(e)
	    
	    let x = touchInfo.x
	    let y = touchInfo.y

	    this.fCurrentStroke.pushStrokePt({x:x,y:y}, touchInfo.pressure)		    
	}
	
    }

    mouseUp(e)
    {
	super.mouseUp(e)

	if (this._strokeStarted) {
	    // Figure out the box.
	    //
	    let box = this.fCurrentStroke.axisAlignedBox()
	    if (box != null) {
		let center = box['center'];
		let width  = box['width'];
		let height = box['height'];
		
		this.fCanvas._box2dWorld.addBox(center, width, height, this.fCanvas.getCurrentFrame())
	    }
	    
	    // Reset the stroke.
	    //
	    this.fCurrentStroke.clear()

	    // Hack to refresh. Need a better mechanism.
	    //
	    if (this.fCanvas._pauseAnim) {
		this.fCanvas.setFrame(this.fCanvas._currentFrame)
	    }

	}
	this._strokeStarted = false

	console.log("made the box")
    }
}

export default Ttool_makeBox
