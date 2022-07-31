import Tdiv                from "./Tdiv.js";

class Ttoolbar_scissors extends Tdiv
{
    constructor(toolbar_scissorsId, callOnDismissFn, callOnExecuteFn)
    {
	super(toolbar_scissorsId)

	this._callOnDismissFn = callOnDismissFn
	this._callOnExecuteFn = callOnExecuteFn	


	this._scissorsExecuteCtrl = document.getElementById("scissorsExecuteId")
	this._scissorsDismissCtrl = document.getElementById("scissorsDismissId")

	this._scissorsExecuteCtrl.addEventListener('click', (e) => {
	    this.scissorsExecuteClick(e)
	});

	this._scissorsDismissCtrl.addEventListener('click', (e) => {
	    this.scissorsDismissClick(e)
	});

	this.hide()
    }

    scissorsExecuteClick(e)
    {
	console.log("execute")

	if (this._callOnExecuteFn != null) {
	    this._callOnExecuteFn()
	}
/*
	this.hide()

	if (this._callOnDismissFn != null) {
	    this._callOnDismissFn()
	}
*/
    }
    
    scissorsDismissClick(e)
    {
	this.hide()

	if (this._callOnDismissFn != null) {
	    this._callOnDismissFn()
	}
    }
    
    hide()
    {
	super.hide()
    }

}


export default Ttoolbar_scissors
