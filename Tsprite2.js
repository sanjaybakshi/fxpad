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

	this._imgFile   = null	
	this._imgBitmap = null
    }
    
    draw(ctx)
    {
	if (this._imgBitmap != null) {
	    ctx.save()
	    
	    ctx.translate(this._pos.x, this._pos.y)
	    ctx.rotate(this._rot);
	    ctx.scale(1, 1);

	    
	    ctx.drawImage(this._imgBitmap,
			  Math.floor(-this._imgBitmap.width  / 2),
			  Math.floor(-this._imgBitmap.height / 2));
	    ctx.restore()
	}
    }

    resize(spriteWidth, spriteHeight)
    {
	this._drawImageOnBitmap(this._imgFile, spriteWidth, spriteHeight)
    }




    
    initBitmap(spriteWidth, spriteHeight)
    {
	let img = new Image(spriteWidth, spriteHeight)
	this._drawImageOnBitmap(img, spriteWidth, spriteHeight)
    }

    initBitmapWithImage(img, spriteWidth, spriteHeight)
    {
	this._imgFile = img
	this._drawImageOnBitmap(this._imgFile, spriteWidth, spriteHeight)
    }
    
    hasImage()
    {
	return (this._imgFile != null)
    }

    hasBitmap()
    {
	return (this._imgBitmap != null)
    }

    bitmapWidth()
    {
	return this._imgBitmap.width
    }

    bitmapHeight()
    {
	return this._imgBitmap.height
    }

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
    }
    
}

export default Tsprite2
