import Tdiv                from "./Tdiv.js";
import Tparams_strokeWidth from "./Tparams_strokeWidth.js";

class Ttoolbar_paint extends Tdiv
{
    constructor(toolbar_paintId, callOnDismissFn, canvas)
    {
	super(toolbar_paintId)

	this.fCanvas = canvas

	this._callOnDismissFn = callOnDismissFn
	
	this._strokeWidthCtrl   = document.getElementById("strokeWidthId")

	this._strokeColorCtrl   = document.getElementById("strokeColorId")
	this._strokeDismissCtrl = document.getElementById("strokeDismissId")

	this._params_strokeWidth = new Tparams_strokeWidth("params.strokeWidthId",
							   this.strokeWidthChange_func.bind(this),
							   this.strokeOpacityChange_func.bind(this))
	
	
	this._strokeWidthCtrl.addEventListener('click', (e) => {
	    this.strokeWidthClick(e)
	});
	this._strokeWidthCtrl.addEventListener('mousedown', (e) => {
	    e.stopPropagation()
	});

	this._strokeWidthCtrl.addEventListener('mouseup', (e) => {
	    e.stopPropagation()
	});

	
	this._strokeColorCtrl.addEventListener('click', (e) => {
	    this.strokeColorClick(e)
	});

	this._strokeColorCtrl.addEventListener('change', (e) => {
	    this.strokeColorChange(e)
	});

	this._strokeDismissCtrl.addEventListener('click', (e) => {
	    this.strokeDismissClick(e)
	});

	this.hide()
    }
    
    strokeWidthClick(e)
    {
	console.log("strokeWidthClick")
	let r = this._div.getBoundingClientRect()
	let posX = r.left
	let posY = r.bottom
	
	//this._params_strokeWidth.toggleDisplayAt([posX,posY])
	this._params_strokeWidth.showAt([posX,posY])		
    }

    strokeColorClick(e)
    {
	if (this._params_strokeWidth.isVisible()) {
	    this._params_strokeWidth.hide()
	}

    }

    strokeColorChange(e)
    {
	this.fCanvas.fCurrentStroke._color = e.target.value
    }
    
    strokeDismissClick(e)
    {
	this.hide()
	this._params_strokeWidth.hide()

	this._callOnDismissFn()
    }
    
    strokeWidthChange_func(v)
    {
	this.fCanvas.fCurrentStroke._brushWidth = v

    }
    strokeOpacityChange_func(v)
    {
    }

    hide()
    {
	super.hide()

	if (this._params_strokeWidth.isVisible()) {
	    this._params_strokeWidth.hide()
	}
    }

}


export default Ttoolbar_paint
