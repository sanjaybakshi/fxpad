import Tdiv from "./Tdiv.js";
import Ttoolbar_paint from "./Ttoolbar_paint.js";


class Ttoolbar_box extends Tdiv
{
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
	console.log("translate click")
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
    }

    isVisible() {
	return (super.isVisible() || this._toolbar_paint.isVisible())
    }
}


export default Ttoolbar_box
	
