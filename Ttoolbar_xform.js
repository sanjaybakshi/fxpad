import Tdiv         from "./Tdiv.js";
import Tstroke      from "./Tstroke.js";
import TdrawUtils   from "./TdrawUtils.js";
import Ttouch       from "./Ttouch.js";

class Ttoolbar_xform extends Tdiv
{
    constructor(toolbar_xformId, callOnDismissFn, canvas)
    {
	super(toolbar_xformId)

	this.fCanvas = canvas

	this._callOnDismissFn = callOnDismissFn
	
	this._xformDismissCtrl  = document.getElementById("xformDismissId")


	this.fCurrentStroke = new Tstroke()
	this._strokeStarted = false

	this._boxManipSize     = 20

	this._boxManipDefColor  = 'red'
	this._boxManipMoveColor = 'yellow'

	this._boxManipColor    = this._boxManipDefColor
	
	this._xformDismissCtrl.addEventListener('click', (e) => {
	    this.xformDismissClick(e)
	});

	this.hide()	
    }
    
    xformDismissClick(e)
    {
	this.hide()

	// Put the canvas in the default tool.
	//
	this._callOnDismissFn()
    }
    
    hide()
    {
	super.hide()
    }


    draw(ctx, objs)
    {
	if (objs.length > 0) {
	    let obj = objs[0]

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
	    //TdrawUtils.drawRect(ctx, center, 20, 20)
	    
	}
    }

    mouseDown(e, objs)
    {
	console.log("mouseDown")
	if (objs.length > 0) {
	    let obj = objs[0]
	    
	    let center = obj.getCenterInPixels()
	    
	    let touchInfo = Ttouch.getTouch(e)
	
	    let x = touchInfo.x
	    let y = touchInfo.y
	    
	    if (TdrawUtils.isInsideRect({x:x,y:y}, center, this._boxManipSize, this._boxManipSize)) {
		this._boxManipColor = this._boxManipMoveColor
		this._strokeStarted = true
	    }
	    
	    /*
	      this.fCurrentStroke.push([x,y], touchInfo.pressure)
	    */
	    
	}
    }
    mouseMove(e, objs)
    {
	console.log("mouseMove")

	if (objs.length > 0 && this._strokeStarted) {
	    let obj = objs[0]
	    
	    let center = obj.getCenterInPixels()
	    
	    let touchInfo = Ttouch.getTouch(e)
	    
	    let x = touchInfo.x
	    let y = touchInfo.y

	    obj.setPosition({x:x,y:y})

	    //this.showAt([x,y])
	}

    }
    
    mouseUp(e, objs)
    {
	console.log("mouseUp")
	this._boxManipColor = this._boxManipDefColor
	this._strokeStarted = false
    }

}


export default Ttoolbar_xform
