

class Timage
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

	this._imgBitmap = null
	this._useFileTexture = false
    }

    imageFromFile(filename, callbackFunc)
    {
	let i = new Image
	i.src = filename

	
	var loadImageFunction = function(e) {

	    let img = e["target"]
	    
	    let inMemoryCanvas  = document.createElement("canvas")
	    let inMemoryContext = inMemoryCanvas.getContext("2d");

	    //inMemoryCanvas  = document.getElementById("fxCanvas")
	    //inMemoryContext = inMemoryCanvas.getContext('2d')

	    inMemoryCanvas.width = img.width
	    inMemoryCanvas.height = img.height
	    
	    //inMemoryContext.width  = img.width;
	    //inMemoryContext.height = img.height;
	    inMemoryContext.drawImage(img, 0, 0);

	    this.grabImageFromCanvas(inMemoryCanvas, 0+img.width/2, 0+img.height/2, 0, img.width, img.height);

	    this.setScaleWH(img.width, img.height)
	    this.callbackFunc(img.width, img.height)
	}

	this.callbackFunc = callbackFunc
	let boundLoadImageFunction = loadImageFunction.bind(this)
	
	i.onload = boundLoadImageFunction
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
    }
    
    draw(ctx)
    {
	//console.log(this._pos[0],this._pos[1])

	if (this._imgBitmap != null) {
	    ctx.save()
	    ctx.translate(this._pos[0], this._pos[1])
	    ctx.rotate(this._rot);
	    ctx.scale(this._scaleX, this._scaleY);

	    ctx.drawImage(this._imgBitmap, -this._imgBitmap.width / 2, -this._imgBitmap.height / 2);

	    //ctx.putImageData(this._imgBitmap, -this._imgBitmap.width / 2, -this._imgBitmap.height / 2);	
	    ctx.restore()

	    this._rot = this._rot + (1.0 * Math.PI / 180);
	}
    }

    
    grabImageFromCanvas(canvas, x, y, rot, width, height)
    {
	//console.log(x,y,rot,width,height)

	var setBitmapFunction = function(bm) {
	    this._imgBitmap = bm;

	}

	let boundBitmapFunction = setBitmapFunction.bind(this)

	/*
	createImageBitmap(canvas, x-width/2, y-height/2, width, height).then(function(bm) {

	    this._imgBitmap = bm;

	});
	*/
	createImageBitmap(canvas, x-width/2, y-height/2, width, height).then(boundBitmapFunction)
    }
    
/*
    draw(ctx)
    {
	if (this._image.complete) {


	    ctx.setTransform(this._scaleX, 0, 0, this._scaleY,
			     this._pos[0],
			     this._pos[1]); // sets scales and origin
	    ctx.rotate(this._rot);	    

	    //ctx.drawImage(this._image, -this._image.width / 2, -this._image.height / 2);
	//ctx.drawImage(this._image, -this._image.width / 2, -this._image.height / 2);

	    ctx.drawImage(this._image, 0, 0)

	    this._rot = this._rot + (1.0 * Math.PI / 180);
	    

	    //ctx.drawImage(this._image, 0, 0);

	    //console.log(this._image.width)


	}
    }
*/
}

export default Timage
