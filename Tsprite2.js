import Tfont from  "./Tfont.js"
import Tmath from "./Tmath.js"




class Tsprite2
{
    _pos;
    _rot;
    
    constructor()
    {
	this._pos    = {x:0, y:0}
	this._rot    = 0.0;

	//this._imgFile   = null	
	//this._imgBitmap = null

	this._img = null
	
	this._drawWidth  = 0
	this._drawHeight = 0

    }
    
    draw(ctx)
    {
	if (this._img != null) {
	    ctx.save()

	    
	    ctx.translate(this._pos.x, this._pos.y)
	    ctx.rotate(this._rot);
	    ctx.scale(1, 1);

/*	    
	    ctx.drawImage(this._imgBitmap,
			  Math.floor(-this._imgBitmap.width  / 2) ,
			  Math.floor(-this._imgBitmap.height / 2),
			  
			 );
*/
	    //console.log(this._pixelRatio)
	    ctx.drawImage(this._img,
			  Math.floor(-this._drawWidth  / 2),
			  Math.floor(-this._drawHeight / 2),
			  //this._drawWidth / this._pixelRatio,
			  //this._drawHeight/ this._pixelRatio
			  this._drawWidth,
			  this._drawHeight
			  
			 );

	    
	    ctx.restore()
	}
    }

    /*
    resize(spriteWidth, spriteHeight)
    {
	this._drawImageOnBitmap(this._imgFile, spriteWidth, spriteHeight)
    }

    
    initBitmap(spriteWidth, spriteHeight)
    {
	let img = new Image(spriteWidth, spriteHeight)
	this._drawImageOnBitmap(img, spriteWidth, spriteHeight)
    }
    */
    initBitmap(img, scaleFactor)
    {
	this._img    = img
	//this._imgBitmap  = img

	this._drawWidth  = Math.floor(img.width  * scaleFactor)
	this._drawHeight = Math.floor(img.height * scaleFactor)

	console.log("initBitmap: " + this._drawWidth, this._drawHeight)

    }

    scaleFactor()
    {
	return (this._drawWidth / this._img.width)
    }
    
    /*
    initBitmapWithBitmap(bitmap)
    {
	this._imgBitmap = bitmap
    }
    */
    hasImage()
    {
	return (this._img != null)
    }
/*
    hasBitmap()
    {
	return (this._imgBitmap != null)
    }
*/
    drawWidth()
    {
	return this._drawWidth
    }

    drawHeight()
    {
	return this._drawHeight
    }

    /*
    drawStrokeOnBitmap(stroke)
    {
	if (!this.hasBitmap()) {
	    console.log("Error- need to call initBitmap before drawing stroke.")
	    return
	}

	let inMemoryCanvas = new OffscreenCanvas(this.bitmapWidth(), this.bitmapHeight())
	let inMemoryContext = inMemoryCanvas.getContext("2d");
	inMemoryContext.drawImage(this._imgBitmap, 0, 0)

	// draw stroke.
	//
	stroke.draw(inMemoryContext)
	
	this._imgBitmap = inMemoryCanvas.transferToImageBitmap()
    }
    
    _drawImageOnBitmap(img, spriteWidth, spriteHeight)
    {
	let inMemoryCanvas = new OffscreenCanvas(spriteWidth, spriteHeight)
	let inMemoryContext = inMemoryCanvas.getContext("2d");
	
	let sx = 0
	let sy = 0
	let swidth  = img.width
	let sheight = img.height
	
	let dx = 0
	let dy = 0
	let dwidth  = spriteWidth
	let dheight = spriteHeight
	
	inMemoryContext.drawImage(img, sx, sy, swidth, sheight, dx, dy, dwidth, dheight);
	
	this._imgBitmap = inMemoryCanvas.transferToImageBitmap()
    }

    drawTextOnBitmap(text, font, fontSize)
    {
	if (!this.hasBitmap()) {
	    console.log("Error- need to call initBitmap before drawing text.")
	    return
	}
	
	let inMemoryCanvas = new OffscreenCanvas(this.bitmapWidth(), this.bitmapHeight())
	let inMemoryContext = inMemoryCanvas.getContext("2d");
	//let inMemoryCanvas  = document.createElement("canvas")
	//let inMemoryContext = inMemoryCanvas.getContext("2d");


	//inMemoryCanvas.style.width  = this.bitmapWidth()  + "px"
	//inMemoryCanvas.style.height = this.bitmapHeight() + "px"	

	//var scale = window.devicePixelRatio;
	//inMemoryCanvas.width  = Math.floor(this.bitmapWidth()  * scale);
	//inMemoryCanvas.height = Math.floor(this.bitmapHeight() * scale);

	//inMemoryContext.scale(scale, scale)
	
	inMemoryContext.font = fontSize + 'px ' + font
	inMemoryContext.textBaseline = 'top';	
	
	let textBoxes = Tfont.wrapTextInBox(text, font, fontSize, this.bitmapWidth())

	//console.log(textBoxes)
	// Iterate over the words and draw them.
	//
	for (let i=0; i < textBoxes.words.length; i++) {
	    
	    let w = textBoxes.words[i]
	    let r = textBoxes.wordRects[i]
	    
	    inMemoryContext.fillText(w, r.x, r.y);
	}
	this._imgBitmap = inMemoryCanvas.transferToImageBitmap()
*/

/*
	var setBitmapFunction = function(bm) {
	    this._imgBitmap = bm;
	}

	let boundBitmapFunction = setBitmapFunction.bind(this)

	createImageBitmap(inMemoryCanvas, 0, 0, this.bitmapWidth(), this.bitmapHeight(),
			  {resizeQuality:"high"}).then(boundBitmapFunction)
*/	
	
//    }
/*
    extractBitmap(left, top, right, bottom)
    {
	let inMemoryCanvas = new OffscreenCanvas(right-left, bottom-top)
	let inMemoryContext = inMemoryCanvas.getContext("2d");

	if (this._imgBitmap != null) {
	    console.log(left,top,right,bottom)
	    inMemoryContext.drawImage(this._imgBitmap, -left, -top, right-left, bottom-top, 0, 0, right-left, bottom-top);
	}

	return(inMemoryCanvas.transferToImageBitmap())
	
    }
*/
    snipOrigImage(left, top, right, bottom)
    {
	let inMemoryCanvas = new OffscreenCanvas(right-left, bottom-top)
	let inMemoryContext = inMemoryCanvas.getContext("2d");

	if (this._imgBitmap != null) {
	    console.log(left,top,right,bottom)
	    inMemoryContext.drawImage(this._imgBitmap, -left, -top, right-left, bottom-top, 0, 0, right-left, bottom-top);
	}

	this._imgBitmap = inMemoryCanvas.transferToImageBitmap()
	
    }
}

export default Tsprite2
