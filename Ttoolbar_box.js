import Tdiv from "./Tdiv.js";

import { fModel } from './Tmodel.js'


class Ttoolbar_box extends Tdiv
{
    constructor(toolbar_boxId, canvas)
    {
	super(toolbar_boxId)
	
	this._lockCtrl   = document.getElementById("lockBoxId")
	this._paramsCtrl = document.getElementById("params2BoxId")
	this._splitCtrl  = document.getElementById("splitBoxId")
	this._deleteCtrl = document.getElementById("deleteBoxId")
	
	this.fCanvas = canvas
	
	this._lockCtrl.addEventListener('click', (e) => {
	    this.lockClick(e)
	});

	this._lockCtrl.addEventListener('mousedown', (e) => {
	    e.stopPropagation()
	});

	this._lockCtrl.addEventListener('mouseup', (e) => {
	    e.stopPropagation()
	});

	this._paramsCtrl.addEventListener('click', (e) => {
	    this.paramsClick(e)
	});

	this._paramsCtrl.addEventListener('mousedown', (e) => {
	    e.stopPropagation()
	});

	this._paramsCtrl.addEventListener('mouseup', (e) => {
	    e.stopPropagation()
	});

	
	this._splitCtrl.addEventListener('click', (e) => {
	    this.splitClick(e)
	});

	this._splitCtrl.addEventListener('mousedown', (e) => {
	    e.stopPropagation()
	});

	this._splitCtrl.addEventListener('mouseup', (e) => {
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
    
    lockClick(e)
    {
	for (const obj of fModel.fSelectionList._sList) {
	    if (obj.isDynamic()) {
		obj.setStatic()
	    } else {
		obj.setDynamic()
	    }
	}
    }

    splitClick(e)
    {
	let newBoxes = []
	for (const obj of fModel.fSelectionList._sList) {
	    //let bxs = this.fCanvas._box2dWorld.split(obj, this.fCanvas.getCurrentFrame())
	    let bxs = fModel.fBox2dWorld.split(obj, this.fCanvas.getCurrentFrame())

	    for (const b of bxs) {
		newBoxes.push(b)
	    }
	}

	for (const obj of fModel.fSelectionList._sList) {
	    fModel.fBox2dWorld.deleteBox(obj)
	}
	

	// Have to do this so the newly created boxed gets added to the simulation.
	// kind of a hack.
	//
	this.fCanvas.setFrame(this.fCanvas.getCurrentFrame())

	// Need to call this here (not right after creating it because it won't be fully
	// construcuted until setFrame is called.
	//	
	fModel.fSelectionList.replace(newBoxes)	
    }

    deleteClick(e)
    {
	for (const obj of fModel.fSelectionList._sList) {
	    fModel.fBox2dWorld.deleteBox(obj)	    
	}

	fModel.fSelectionList.clear()
    }

    paramsClick(e)
    {
	console.log("params click")
	for (const obj of fModel.fSelectionList._sList) {
	    if (obj.isActivatedOnCollision()) {
		obj.setActivateOnCollision(false)
	    } else {
		obj.setActivateOnCollision(true)
	    }
	}

    }
}


export default Ttoolbar_box
	
