

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

    static crop(img, left, top, right, bottom)
    {
	console.log(left,top,right,bottom)
	let inMemoryCanvas = new OffscreenCanvas(right-left, bottom-top)
	let inMemoryContext = inMemoryCanvas.getContext("2d");

	inMemoryContext.drawImage(img, left, top, right-left, bottom-top, 0, 0, right-left, bottom-top)
	console.log("coords " + -left, -top, right-left, bottom-top)
	return(inMemoryCanvas.transferToImageBitmap())
    }
    

}

export default Timage
