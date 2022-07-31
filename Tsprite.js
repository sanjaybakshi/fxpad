import Tfont from  "./Tfont.js"


class Tsprite
{
    _pos;
    _rot;
    _scaleX;
    _scaleY;
    
    constructor(pos)
    {
	this._pos    = pos;
	this._rot    = 0.0;
	this._scaleX = 1.0
	this._scaleY = 1.0

	//this._image = new Image;
	//this._image.src = "testimg.png";

	
	//this._imgData = this.imageFromFile("testimg.png")

	this._origFileImage = null
	
	this._imgBitmap = null
	this._useFileTexture = false

	this._widthInPixels = 0
	this._heightInPixels = 0
    }

    setOrigFileImage(img)
    //
    // Description:
    //		If the source of the sprite was an image that was pasted or dropped,
    //		we keep it so we can resize the box and get the original resolution.
    {
	this._origFileImage = img	
    }
    
    setScale(sizeInPixels)
    //
    // Description:
    //	   Will scale the image so the max size is sizeInPixels and the image
    //	   aspect ratio is respected.
    //
    {
	if (this._useFileTexture == true) {
	    if (this._imgBitmap.ImageBitmap.width > this._imgBitmap.ImageBitmap.height) {
		this._scaleX = sizeInPixels / this._imgBitmap.ImageBitmap.width
		this._scaleY = this._scaleX
	    } else {
		this._scaleY = sizeInPixels / this._imgBitmap.ImageBitmap.height
		this._scaleX = this._scaleY
	    }
	}
    }

    setScaleWH(sizeInPixelsWidth, sizeInPixelsHeight)
    //
    // Description:
    //	    Will scale the image to be exactly with specified width/height.
    //	    Ignored the aspect ratio of the image.
    //
    {
	if (this._useFileTexture == true) {

	    this._scaleX = sizeInPixelsWidth  / this._imgBitmap.ImageBitmap.width
	    this._scaleY = sizeInPixelsHeight / this._imgBitmap.ImageBitmap.height
	} 

	this._widthInPixels  = sizeInPixelsWidth
	this._heightInPixels = sizeInPixelsHeight
	
    }

    draw(ctx)
    {
	if (this._imgBitmap != null) {
	    ctx.save()

	    
	    ctx.translate(this._pos[0], this._pos[1])
	    ctx.rotate(this._rot);
	    ctx.scale(this._scaleX, this._scaleY);

	    
	    ctx.drawImage(this._imgBitmap,
			  Math.floor(-this._imgBitmap.width  / 2),
			  Math.floor(-this._imgBitmap.height / 2));
	    ctx.restore()
	}
    }

    resizeSprite(newWidth, newHeight)
    {
	//this.setScaleWH(newWidth, newHeight)

	this._scaleX = newWidth  / this._imgBitmap.width
	this._scaleY = newHeight / this._imgBitmap.height
	
	console.log(this._scaleX, this._scaleY)
    }
    
    drawFileOnSprite(img)
    {
	let inMemoryCanvas  = document.createElement("canvas")
	let inMemoryContext = inMemoryCanvas.getContext("2d");

	inMemoryCanvas.width  = img.width
	inMemoryCanvas.height = img.height

	this.setScaleWH(img.width, img.height)
	
	inMemoryContext.drawImage(img, 0, 0);

	this.canvas2bitmap(inMemoryCanvas)
	    
    }

    drawStrokeOnSprite(stroke)
    {
	let inMemoryCanvas  = document.createElement("canvas")
	let inMemoryContext = inMemoryCanvas.getContext("2d");

	inMemoryCanvas.width  = this._widthInPixels
	inMemoryCanvas.height = this._heightInPixels

	if (this._imgBitmap != null) {
	    inMemoryContext.drawImage(this._imgBitmap, 0, 0);
	}
	

	// draw stroke.
	//
	stroke.draw(inMemoryContext)


	this.canvas2bitmap(inMemoryCanvas)
    }

    drawTextOnSprite(text, font, fontSize)
    {
	//let inMemoryCanvas  = document.createElement("canvas")
	//let inMemoryContext = inMemoryCanvas.getContext("2d");


	let inMemoryCanvas = new OffscreenCanvas(this._widthInPixels, this._heightInPixels)
	let inMemoryContext = inMemoryCanvas.getContext("2d");

	
	inMemoryContext.font = fontSize + 'px ' + font
	inMemoryContext.textBaseline = 'top';	
	
	let textBoxes = Tfont.wrapTextInBox(text, font, fontSize, this._widthInPixels)

	//console.log(textBoxes)
	// Iterate over the words and draw them.
	//
	for (let i=0; i < textBoxes.words.length; i++) {
	    
	    let w = textBoxes.words[i]
	    let r = textBoxes.wordRects[i]
	    
	    inMemoryContext.fillText(w, r.x, r.y);
	}
	//this.canvas2bitmap(inMemoryCanvas)
	this._imgBitmap = inMemoryCanvas.transferToImageBitmap()
    }
    
    canvas2bitmap(canvas)
    {
	var setBitmapFunction = function(bm) {
	    this._imgBitmap = bm;
	}

	let boundBitmapFunction = setBitmapFunction.bind(this)

	createImageBitmap(canvas, 0, 0, this._widthInPixels, this._heightInPixels,
			  {resizeQuality:"high"}).then(boundBitmapFunction)	
    }

    extractBitmap(left, top, right, bottom, doneFunc)
    {
	let inMemoryCanvas  = document.createElement("canvas")
	let inMemoryContext = inMemoryCanvas.getContext("2d");
	
	inMemoryCanvas.width  = this._widthInPixels
	inMemoryCanvas.height = this._heightInPixels

	if (this._imgBitmap != null) {
	    inMemoryContext.drawImage(this._imgBitmap, 0, 0);
	}
	createImageBitmap(inMemoryCanvas, left, top, right-left, bottom-top,
			  {resizeQuality:"high"}).then(doneFunc)	
    }
}

export default Tsprite
