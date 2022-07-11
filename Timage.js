

class Timage
{
    constructor()
    {
	this._img = new Image
    }

    imageFromFile(filename, callbackFunc)
    {
	this._img.src    = filename
	this._img.onload = callbackFunc
    }


}

export default Timage
