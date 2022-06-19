import Ttool      from "./Ttool.js";
import Ttouch     from "./Ttouch.js";
import TdrawUtils from "./TdrawUtils.js";


class Ttool_xform extends Ttool
{
    
    constructor(canvas)
    {
	super()

	this.fCanvas = canvas

	this._boxManipSize     = 20

	this._boxManipDefColor  = 'red'
	this._boxManipMoveColor = 'yellow'

	this._boxManipColor    = this._boxManipDefColor

	this._strokeStarted = false
    }

    mouseDown(e)
    {
	console.log("xform-mouseDown")
	super.mouseDown(e)

	if (this.fCanvas._selectionList._sList.length > 0) {
	    let obj = this.fCanvas._selectionList._sList[0]

	    let center = obj.getCenterInPixels()
	
	    let touchInfo = Ttouch.getTouch(e)
	    
	    let x = touchInfo.x
	    let y = touchInfo.y

	    if (TdrawUtils.isInsideRect({x:x,y:y}, center, this._boxManipSize, this._boxManipSize)) {
		this._boxManipColor = this._boxManipMoveColor
		this._strokeStarted = true
	    }
	}
    }

    mouseMove(e)
    {
	super.mouseMove(e)	

	if (this.fCanvas._selectionList._sList.length > 0 && this._strokeStarted) {
	    let obj = this.fCanvas._selectionList._sList[0]
	    
	    let center = obj.getCenterInPixels()
	    
	    let touchInfo = Ttouch.getTouch(e)
	    
	    let x = touchInfo.x
	    let y = touchInfo.y

	    obj.setPosition({x:x,y:y})

	    //this.showAt([x,y])
	}

    }

    mouseUp(e)
    {
	console.log("xform->mouseUp")
	super.mouseUp(e)

	this._boxManipColor = this._boxManipDefColor
	this._strokeStarted = false
    }

    draw(ctx)
    {
	super.draw(ctx)

	if (this.fCanvas._selectionList._sList.length > 0) {
	    let obj = this.fCanvas._selectionList._sList[0]

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
	}
	
    }
    
}

export default Ttool_xform
