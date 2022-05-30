import Tmath   from "./Tmath.js";
import Tsprite from "./Tsprite.js";
import Timage  from "./Timage.js";

import Tfont   from  "./Tfont.js"

//import * as Box2D from "./planck/planck.js";
//import * as gg from "./planck/planck.js";

//let Box2D = planck


let fCanvasWidth  = 0
let fCanvasHeight = 0

let fWorldWidth   = 0
let fWorldHeight  = 0


/*

  TfxPage.swift

   animTimeline = { ['frame': 0, 
                     'objects': [1,3,4]],
                    ['frame: 



 */





function pixels2world_vec(v)
{
    let newVec = planck.Vec2()

    let x = Tmath.remap(0, fCanvasWidth,  0, fWorldWidth,  v.x)
    let y = Tmath.remap(0, fCanvasHeight, 0, fWorldHeight, v.y)

    // flip y
    y = fWorldHeight - y;
	
    newVec.x = x;
    newVec.y = y;
    return newVec	
}

function world2pixels_vec(v)
{
    let newVec = planck.Vec2()

    let x = Tmath.remap(0, fWorldWidth,  0, fCanvasWidth,  v.x)
    let y = Tmath.remap(0, fWorldHeight, 0, fCanvasHeight, v.y)

    // flip y
    y = fCanvasHeight - y;
	
    newVec.x = x;
    newVec.y = y;
    return newVec	
}


class Tbox
{
    _widthPixels;
    _heightPixels;
    _v_pixels;
    _body;
    _existanceStart;
    _isDynamic;
    _sprite;
    _body;
    
    constructor(pos, width, height, existanceStart, isDynamic=true)
    {
	this._widthPixels  = width
	this._heightPixels = height
	this._existanceStart = existanceStart
	
	this._v_pixels = planck.Vec2(pos[0], pos[1])
	this._isDynamic = isDynamic
	
	// Setup the image in the box.
	//
	this._sprite = new Tsprite(pos)
	this._sprite.setScaleWH(width, height);

	this._text = ""
	this._fontSize = 16
	this._fontName = "Georgia"
	
    }

    isStatic()
    {
	return (this._body.getType() == 0)
    }

    removeFromSimulation()
    {
	this._body = null
    }

    isBeingSimulated()
    {
	return this._body != null
    }
    
    addToSimulation(world)
    {
	let body = world.createBody();

	if (this._isDynamic) {
	    body.setDynamic()
	}

	let v_world  = pixels2world_vec(this._v_pixels) 
	body.setPosition(v_world)

	
	
	let w = Tmath.remap(0, fCanvasWidth,  0, fWorldWidth,  this._widthPixels)
	let h = Tmath.remap(0, fCanvasHeight, 0, fWorldHeight, this._heightPixels)
	let shape = planck.Box(w/2, h/2);
	body.createFixture(shape, 1.0);

	// time to set mass information
        body.setMassData({
            mass: 1,
            center: planck.Vec2(),

            // I have to say I do not know the meaning of this "I", but if you set it to zero, bodies won't rotate
            I: 1
	});
	    
	this._body = body
    }

    
    draw(ctx)
    {
	let pos_world = this._body.getPosition();
	let rot       = this._body.getAngle();

	// map coordinates from world to screen.
	//
	let pos_pixels = world2pixels_vec(pos_world)


	if (!this.isStatic()) {
	    this._sprite._rot = -rot
	    //console.log(pos_pixels.get_x(),pos_pixels.get_y())
	    this._sprite._pos = [Math.floor(pos_pixels.x), Math.floor(pos_pixels.y)]
	    //console.log(this._widthPixels, this._heightPixels)
	    this._sprite.draw(ctx)
	}
	
	ctx.beginPath();
	ctx.lineWidth = .5;

	if (this.isStatic()) {
	    //ctx.strokeStyle = 'orange';
	    
	    ctx.strokeStyle = 'black';
	} else {
	    ctx.strokeStyle = 'black';	    
	}
	this.drawRect(ctx, pos_pixels, rot);

	
    }

    intersects(mousePos)
    {
	let v_world  = pixels2world_vec(mousePos)

	// loop through all fixtures
        for (let fixture = this._body.getFixtureList(); fixture; fixture = fixture.getNext()) {
 
	    if (fixture.testPoint(v_world)) {
                return true;
            }
	}
    }
    
    drawRect(ctx, p_pixels, angle)
    {
	let xformMat = Tmath.xformMatrix(-angle, [p_pixels.x, p_pixels.y])

	let p0 = [-this._widthPixels/2, -this._heightPixels/2]
	let p1 = [-this._widthPixels/2,  this._heightPixels/2]
	let p2 = [ this._widthPixels/2,  this._heightPixels/2]
	let p3 = [ this._widthPixels/2, -this._heightPixels/2]

	p0 = Tmath.xformPoint(p0, xformMat)
	p1 = Tmath.xformPoint(p1, xformMat)
	p2 = Tmath.xformPoint(p2, xformMat)
	p3 = Tmath.xformPoint(p3, xformMat)    
    
    
	ctx.beginPath();
	ctx.moveTo(p0[0], p0[1]);
	ctx.lineTo(p1[0], p1[1]);
	ctx.lineTo(p2[0], p2[1]);
	ctx.lineTo(p3[0], p3[1]);
	ctx.lineTo(p0[0], p0[1]);    
	ctx.stroke();	
    	
    }

    drawStrokeOnSprite(stroke)
    {
	// transform the stroke points to the coordinates on the image.
	//
	let bCenter = this.getCenterInPixels()
	let left = bCenter.x - this._widthPixels/2
	let top  = bCenter.y - this._heightPixels/2
	
	stroke.translate(left, top)
	
	this._sprite.drawStrokeOnSprite(stroke)
    }
    

    grabImageFromCanvas(canvas)
    {
	let pos_world = this._body.getPosition();
	let rot       = this._body.getAngle();

	// map coordinates from world to screen.
	//
	let pos_pixels = world2pixels_vec(pos_world)
	
//	this._sprite.grabImageFromCanvas(canvas, pos_pixels.x, pos_pixels.y,
	//					 rot, this._widthPixels, this._heightPixels)
	
	this._sprite.grabImageFromCanvas2(canvas, pos_pixels.x, pos_pixels.y,
					  this._widthPixels, this._heightPixels)
    }

    getCenterInPixels()
    {
	// Probably should rotate the object and then find the center but
	// this is simpler for now.
	//
	let pos_world  = this._body.getPosition();
	let pos_pixels = world2pixels_vec(pos_world)

	let xCenter = pos_pixels.x
	let yCenter = pos_pixels.y

	return {x:xCenter, y:yCenter}
    }

    widthInPixels()
    {
	return this._widthPixels
    }
    
    heightInPixels()
    {
	return this._heightPixels
    }
}



class Tbox2d_world
{

    
    constructor(canvasWidth, canvasHeight) {

	fCanvasWidth  = canvasWidth;
	fCanvasHeight = canvasHeight;

	if (fCanvasWidth > fCanvasHeight) {
	    fWorldWidth  = 10
	    fWorldHeight = fWorldWidth * (canvasHeight/canvasWidth)
	} else {
	    fWorldHeight = 10
	    fWorldWidth  = fWorldHeight * (canvasWidth/canvasHeight)
	}


	this._fObjectList   = []

	this._fGravity = planck.Vec2(0, -10);
	this._fWorld   = planck.World(this._fGravity);

	this._defFontSize = 18
	this._defFontName = "Georgia"

    }
    
    addBox(pos, width, height, frame, isDynamic=true)
    {
	let box = new Tbox(pos, width, height, frame, isDynamic);
	this._fObjectList.push(box)
    }

    addBoxWithTexture(pos, frame, textureFilename, isDynamic=true)
    {

	var addTextureBox_fileLoad = function(e)  {


	    let img = e["target"]

	    let width  = img.width
	    let height = img.height
	    
	    let box = new Tbox(pos, width, height, frame, isDynamic);
	    this._fObjectList.push(box)

	    box._sprite.drawFileOnSprite(img)

	    // hack- this is done in Tcanvas normally but hacking it here
	    // loading the file is delayed so easier to do it here as we
	    // know the file is loaded.
	    //
	    this.setFrame(frame)
	    console.log("adding the box")	    
	}
	
	// Load the image.
	//
	let img = new Timage()
	let bound_addTextureBox_fileLoad = addTextureBox_fileLoad.bind(this)
	img.imageFromFile(textureFilename, bound_addTextureBox_fileLoad)
    }

    addBoxWithText(pos, width, frame, text, font=this._defFontName, fontSize=this._defFontSize, isDynamic=true)
    {

	let estimatedTextBox = Tfont.wrapTextInBox(text, font, fontSize, width)

	let bWidth  = Math.floor(estimatedTextBox.width)
	let bHeight = Math.floor(estimatedTextBox.height)
	
	let box = new Tbox(pos, bWidth, bHeight, frame, isDynamic);

	box._text     = text
	box._fontSize = fontSize
	box._fontName = font

	this._fObjectList.push(box)

	box._sprite.drawTextOnSprite(text, font, fontSize)
    }


    split(b, frame, isDynamic=true)
    {
	console.log(b._text)
	if (b._text != "") {
	    this.splitIntoWordBoxes(b, frame, isDynamic)
	} else {
	    let boxCenter = b.getCenterInPixels()
	    let left = boxCenter.x - b._widthPixels/2
	    let top  = boxCenter.y - b._heightPixels/2


	    let xDivisions = 2
	    let yDivisions = 2


	    let bWidth  = b._widthPixels  / xDivisions
	    let bHeight = b._heightPixels / yDivisions

	    let xCoord = left + bWidth/2
	    let yCoord = top  + bHeight/2 

	    let spriteXCoord = 0
	    let spriteYCoord = 0
	    
	    for (let y=0; y < yDivisions; y++) {
		for (let x=0; x < xDivisions; x++) {

		    let box = new Tbox([xCoord,yCoord], bWidth, bHeight, frame, isDynamic);
		    this._fObjectList.push(box)

		    
		    var setBoxBitmap = function(bm) {
			this._sprite._imgBitmap = bm		
		    }

		    let boundBitmapFunction = setBoxBitmap.bind(box)
	    
		    // Extract the bitmap for this rect.
		    //
		    b._sprite.extractBitmap(spriteXCoord, spriteYCoord, spriteXCoord+bWidth, spriteYCoord+bHeight, boundBitmapFunction)
		    
		    xCoord       = xCoord       + bWidth
		    spriteXCoord = spriteXCoord + bWidth
		    
		}
		xCoord = left   + bWidth/2
		yCoord = yCoord + bHeight

		spriteXCoord = 0
		spriteYCoord = spriteYCoord + bHeight
	    }
	}
    }
    
    splitIntoWordBoxes(b, frame, isDynamic=true)
    {
	if (b._text == "") {
	    return
	}
	let estimatedTextBox = Tfont.wrapTextInBox(b._text, b._fontName, b._fontSize, b._widthPixels)

	
	let boxCenter = b.getCenterInPixels()
	let left = boxCenter.x - b._widthPixels/2
	let top  = boxCenter.y - b._heightPixels/2

	for (let i=0; i < estimatedTextBox.words.length; i++) {
	    
	    let r = estimatedTextBox.wordRects[i]
	    
	    let centerX = r.x + r.w/2
	    let centerY = r.y + r.h/2

	    centerX = left + centerX
	    centerY = top  + centerY
	    
	    let box = new Tbox([centerX,centerY], r.w, r.h, frame, isDynamic);
	    this._fObjectList.push(box)

	    var setBoxBitmap = function(bm) {
		this._sprite._imgBitmap = bm		
	    }

	    let boundBitmapFunction = setBoxBitmap.bind(box)
	    
	    // Extract the bitmap for this rect.
	    //
	    b._sprite.extractBitmap(r.x, r.y, r.x+r.w, r.y+r.h, boundBitmapFunction)
	}
    }

    addWordBoxesWithText(pos, width, height, frame, text, font=this._defFontName, fontSize=this._defFontSize, isDynamic=true)
    {

	let tempBox = new Tbox( [pos.x, pos.y], width, height, frame, isDynamic);
			       
	tempBox._text     = text
	tempBox._fontSize = fontSize
	tempBox._fontName = font
	//this._fObjectList.push(tempBox)

	let boxes = tempBox._sprite.computeTextBoxes_words(text, width, font, fontSize)


	for (let i=0; i < boxes.words.length; i++) {

	    let w = boxes.words[i]
	    let r = boxes.wordRects[i]

	    let left = pos.x - width/2;
	    let top  = pos.y - height/2;

	    let xCoord = left + r.x + r.w/2
	    let yCoord = top  + r.y + r.h/2
	    //this.addBoxWithText( [xCoord,yCoord], r.w, frame, w, font="Georgia", fontSize=18, isDynamic=true)
	    this.addBoxWithText( [xCoord,yCoord], r.w, frame, w, font=font, fontSize=fontSize, isDynamic=true)


	    //this.addBox([xCoord,yCoord], r.w, r.h, frame, isDynamic)
	}
    }

    
    step()
    {
	//console.log(fWorld.GetGravity().get_x(),fWorld.GetGravity().get_y()) 
	this._fWorld.step(1/60, 8, 3);

	// crearForces  method should be added at the end on each step
        this._fWorld.clearForces();

    }

    
    draw(ctx)
    {
	for (const b of this._fObjectList) {	
	    // Check to see if it's part of the world.
	    //
	    if (b.isBeingSimulated()) {
		b.draw(ctx)
	    }
	}
    }

    reset()
    {
	this._fWorld = null
	this._fWorld   = planck.World(this._fGravity);

	
	/*
	for (const b of this._fObjectList) {
	    this._fWorld.DestroyBody(b)
	}
	*/
/*
	let bdy = this._fWorld.GetBodyList()
	while (bdy != null) {
	    let nxtBdy = bdy.GetNext()
	    this._fWorld.DestroyBody(b)
	    console.log(nxtBdy)
	    bdy = nxtBdy
	}
*/
	for (const b of this._fObjectList) {
	    b.removeFromSimulation()	    
	}

    }
    
    setFrame(f)
    {
        for (const b of this._fObjectList) {
	    if (b._existanceStart == f) {
		b.addToSimulation(this._fWorld)
	    }
	}
    }

    intersects(mousePos)
    //
    // Description:
    //	    Tests which boxes are behing the mouse position 'p'
    //
    {
	let m = planck.Vec2(mousePos[0], mousePos[1])

        for (const b of this._fObjectList) {

	    if (b.isBeingSimulated()) {

		if (b.intersects(m)) {

		    return b
		}
	    }
	}

	return null

    }

    deleteBox(b)
    {
	b.removeFromSimulation()

	// Delete the object from the list.
	//
	this._fObjectList = this._fObjectList.filter(obj => obj != b);	
    }
}

export default Tbox2d_world

