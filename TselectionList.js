class TselectionList
{
    constructor(selectionListChanged_callback)
    {
	this._sList = []
	this.selListChanged_cb = selectionListChanged_callback
    }

    clear()
    {
	this._sList = []

	this.selListChanged_cb()
    }

    replace(l)
    {
	this._sList = l

	this.selListChanged_cb()
    }

    add(addList)
    {
	this.selListChanged_cb()
    }
    
}

export default TselectionList
