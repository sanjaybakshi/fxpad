import Tdiv from "./Tdiv.js";

class Ttoolbar_box extends Tdiv
{
    constructor(toolbar_boxId, canvas)
    {
	super(toolbar_boxId)
	
	this._snapshotCtrl  = document.getElementById("snapshotBoxId")
	this._boxParamsCtrl = document.getElementById("paramsBoxId")
	this._deleteCtrl    = document.getElementById("deleteBoxId")
	
	this.fCanvas = canvas
	
	this._snapshotCtrl.addEventListener('click', (e) => {
	    this.snapshotClick(e)
	});

	this._snapshotCtrl.addEventListener('mousedown', (e) => {
	    e.stopPropagation()
	});

	this._snapshotCtrl.addEventListener('mouseup', (e) => {
	    e.stopPropagation()
	});

	
	this._boxParamsCtrl.addEventListener('click', (e) => {
	    this.boxParamsClick(e)
	});

	this._boxParamsCtrl.addEventListener('mousedown', (e) => {
	    e.stopPropagation()
	});

	this._boxParamsCtrl.addEventListener('mouseup', (e) => {
	    e.stopPropagation()
	});
	
	this._deleteCtrl.addEventListener('click', (e) => {
	    this.deleteClick(e)
	});

	this._deleteCtrl.addEventListener('mousedown', (e) => {
	    e.stopPropagation()
	});

	this._deleteCtrl.addEventListener('mouseup', (e) => {
	    e.stopPropagation()
	});
	
    }
    
    snapshotClick(e)
    {
	console.log("click on button")
	for (const obj of this.fCanvas._selectionList._sList) {
	    if (obj.isDynamic()) {
		obj.setStatic()
	    } else {
		obj.setDynamic()
	    }
	}
    }

    boxParamsClick(e)
    {
	console.log("boxParams click")

	for (const obj of this.fCanvas._selectionList._sList) {
	    this.fCanvas._box2dWorld.split(obj, this.fCanvas.getCurrentFrame())
	    console.log("calledsplit")
	}

	for (const obj of this.fCanvas._selectionList._sList) {
	    this.fCanvas._box2dWorld.deleteBox(obj)
	}
	
	this.fCanvas._selectionList.clear()

	// Have to do this so the newly created boxed gets added to the simulation.
	// kind of a hack.
	//
	this.fCanvas.setFrame(this.fCanvas.getCurrentFrame())
    }

    deleteClick(e)
    {
	for (const obj of this.fCanvas._selectionList._sList) {
	    this.fCanvas._box2dWorld.deleteBox(obj)
	}

	this.fCanvas._selectionList.clear()
    }
}


export default Ttoolbar_box
	
