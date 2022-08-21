

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
    
    static getBase64Image(img) {
	// Create an empty canvas element
	var canvas = document.createElement("canvas");
	canvas.width  = img.width;
	canvas.height = img.height;
	
	// Copy the image contents to the canvas
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	
	// Get the data-URL formatted image
	// Firefox supports PNG and JPEG. You could check img.src to
	// guess the original format, but be aware the using "image/jpg"
	// will re-encode the image.
	var dataURL = canvas.toDataURL("image/png");
	
	return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

}

export default Timage
