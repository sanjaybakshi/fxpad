class TselectionList
{
    constructor(canvas)
    {
	this._sList = []
	this.fCanvas = canvas
    }

    clear()
    {
	this._sList = []

	this.fCanvas.selectionListChanged()
    }

    replace(l)
    {
	this._sList = l

	this.fCanvas.selectionListChanged()	
    }

    add(addList)
    {
	this.fCanvas.selectionListChanged()
    }
    
}

export default TselectionList
