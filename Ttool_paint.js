import Ttool   from "./Ttool.js";
import Ttouch  from "./Ttouch.js";
import Tstroke from "./Tstroke.js";

import Ttoolbar_paint from "./Ttoolbar_paint.js";


class Ttool_paint extends Ttool
{
    
    constructor(canvas)
    {
	super()

	this.fCanvas = canvas
	this.fCurrentStroke = new Tstroke()

	this._toolbar_paint = new Ttoolbar_paint("toolbar.paintId", null, canvas)
	
	
	this._strokeStarted = false
    }

    mouseDown(e)
    {
	console.log("paint-mouseDown")
	super.mouseDown(e)

	if (this.fCanvas._selectionList._sList.length > 0) {
	    let touchInfo = Ttouch.getTouch(e)
	    
	    let x = touchInfo.x
	    let y = touchInfo.y

	    this._strokeStarted = true
	    this.fCurrentStroke.pushStrokePt({x:x,y:y}, touchInfo.pressure)

	}
    }

    mouseMove(e)
    {
	super.mouseMove(e)	

	if (this.fCanvas._selectionList._sList.length > 0 && this._strokeStarted) {
	    let touchInfo = Ttouch.getTouch(e)
	    
	    let x = touchInfo.x
	    let y = touchInfo.y
	    
	    this.fCurrentStroke.pushStrokePt({x:x,y:y}, touchInfo.pressure)
	    //this.showAt([x,y])
	}

    }

    mouseUp(e)
    {
	console.log("paint->mouseUp a")
	super.mouseUp(e)

	if (this.fCanvas._selectionList._sList.length > 0 && this._strokeStarted) {

	    for (const obj of this.fCanvas._selectionList._sList) {
		obj.drawStrokeOnSprite(this.fCurrentStroke)
	    }
	}

	this._strokeStarted = false
	this.fCurrentStroke.clear()
    }

    draw(ctx)
    {
	super.draw(ctx)

	if (this.fCanvas._selectionList._sList.length > 0 && this._strokeStarted) {
	    let obj = this.fCanvas._selectionList._sList[0]

	    this.fCurrentStroke.draw(ctx)
	    
	}
	
    }

    dismiss()
    {
	super.dismiss()

	this._toolbar_paint.hide()
	
	console.log("dismissing")
    }

    engage()
    {
	super.engage()

	if (this.fCanvas._selectionList._sList.length > 0) {
	    //let pos = this.getPosition()

	    this._toolbar_paint.showAt([400,400])

	}

	
	console.log("engage")
    }
}

export default Ttool_paint
