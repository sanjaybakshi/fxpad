import Tdiv from "./Tdiv.js";
import Ttoolbar_paint from "./Ttoolbar_paint.js";
import Ttoolbar_xform from "./Ttoolbar_xform.js";


class Ttoolbar_box extends Tdiv
{
    kPaintObject = 0
    kXformObject = 1

    constructor(toolbar_boxId, canvas)
    {
	super(toolbar_boxId)
	
	this._penCtrl       = document.getElementById("paintBoxId")
	this._translateCtrl = document.getElementById("translateBoxId")
	this._rotateCtrl    = document.getElementById("rotateBoxId")
	this._snapshotCtrl  = document.getElementById("snapshotBoxId")
	this._boxParamsCtrl = document.getElementById("paramsBoxId")
	this._deleteCtrl    = document.getElementById("deleteBoxId")

	this._toolbar_paint = new Ttoolbar_paint("toolbar.paintId", this.donePainting_func.bind(this), canvas)
	this._toolbar_xform = new Ttoolbar_xform("toolbar.xformId", this.donePainting_func.bind(this), canvas)	
	
	this.fCanvas = canvas


	
	this._penCtrl.addEventListener('click', (e) => {
	    this.pencilClick(e)
	});

	this._translateCtrl.addEventListener('click', (e) => {
	    this.translateClick(e)
	});

	this._rotateCtrl.addEventListener('click', (e) => {
	    this.rotateClick(e)
	});

	this._snapshotCtrl.addEventListener('click', (e) => {
	    this.snapshotClick(e)
	});

	this._boxParamsCtrl.addEventListener('click', (e) => {
	    this.boxParamsClick(e)
	});

	this._deleteCtrl.addEventListener('click', (e) => {
	    this.deleteClick(e)
	});
	
    }
    
    pencilClick(e)
    {
	let pos = this.getPosition()
	this.hide()

	this._toolbar_paint.showAt(pos)
	
	// Put the canvas in paint mode.
	//
	this.fCanvas.setToolMode(this.fCanvas.kDrawTexture)
    }

    translateClick(e)
    {
	let pos = this.getPosition()
	this.hide()

	this._toolbar_xform.showAt(pos)
	
	// Put the canvas in paint mode.
	//
	this.fCanvas.setToolMode(this.fCanvas.kXformObject)
    }

    rotateClick(e)
    {
	console.log("rotate click")
    }

    snapshotClick(e)
    {
	console.log("snapshot click")
    }

    boxParamsClick(e)
    {
	console.log("boxParams click")

	this.fCanvas.splitSelectedBox()
    }

    deleteClick(e)
    {
	this.fCanvas.deleteSelectedBox()
    }


    donePainting_func()
    {

	// Put the canvas in selecpaint mode.
	//
	this.fCanvas.setToolMode(this.fCanvas.kDrawObject)

	this.show()
	
    }

    hide() {
	super.hide()

	if (this._toolbar_paint.isVisible()) {
	    this._toolbar_paint.hide()
	}

	if (this._toolbar_xform.isVisible()) {
	    this._toolbar_xform.hide()
	}
    }

    isVisible() {
	return (super.isVisible() || this._toolbar_paint.isVisible() || this._toolbar_xform.isVisible())
    }


    draw(ctx, objs) {
	if (this.toolMode() == this.kXformObject) {
	    this._toolbar_xform.draw(ctx, objs)
	}
    }

    mouseDown(e, objs) {
	if (this.toolMode() == this.kXformObject) {
	    this._toolbar_xform.mouseDown(e, objs)
	}
	
    }
    mouseMove(e, objs) {
	if (this.toolMode() == this.kXformObject) {
	    this._toolbar_xform.mouseMove(e, objs)
	}
	
    }
    mouseUp(e, objs) {
	if (this.toolMode() == this.kXformObject) {
	    this._toolbar_xform.mouseUp(e, objs)
	}
	
    }
    
    toolMode() {
	if (this._toolbar_xform.isVisible()) {
	    return this.kXformObject;
	} else if (this._toolbar_paint.isVisible()) {
	    return this.kPaintObject;
	}

	return null
    }
}


export default Ttoolbar_box
	
