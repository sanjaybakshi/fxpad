class Tdiv
{
    constructor(divId)
    {
	this._div = document.getElementById(divId)

    }

    toggleDisplay()
    {
	if (this.isVisible()) {
	    this.hide()
	} else {
	    this.show()
	}
    }

    toggleDisplayAt(pos)
    {
	if (this.isVisible()) {
	    this.hide()
	} else {
	    this.showAt(pos)
	}
    }

    isVisible()
    {
	if (this._div.offsetWidth >= 0 && this._div.offsetHeight >= 0 && this._div.getClientRects().length > 0) {
	    return true
	}

	return false

	/*
	if (this._div.style.display == "")
	    // This means it's the default (which is probably visible)
	    return true
	else if (this._div.style.display == "none") {
	    return false
	}
	return true;
	*/
    }

    hide()
    {
	this._div.style.display = "none"
    }

    show()
    {
	this._div.style.display = "inline-grid"
    }

    showAt(pos)
    {
	this._div.style.left = (pos[0] + 'px')
	this._div.style.top  = (pos[1] + 'px')
	
	this._div.style.display = "inline-grid"
    }

    getPosition()
    {
	let r = this._div.getBoundingClientRect()
	return ([r.left, r.top])
    }

    getWidthHeight()
    {
	let r = this._div.getBoundingClientRect()
	return ([r.width, r.height])
    }
}

export default Tdiv

