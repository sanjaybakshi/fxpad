import Tmath      from "./Tmath.js";
import Tsprite    from "./Tsprite.js";
import Tsprite2   from "./Tsprite2.js";
import Timage     from "./Timage.js";

import Tfont	  from  "./Tfont.js"
import TdrawUtils from "./TdrawUtils.js"
import Trect      from "./Trect.js"


let fCanvasWidth  = 0
let fCanvasHeight = 0

let fWorldWidth   = 0
let fWorldHeight  = 0


let usePlanck = 1



function pixels2world_vec(v)
{
    if (usePlanck) {
	let newVec = planck.Vec2()

	let x = Tmath.remap(0, fCanvasWidth,  0, fWorldWidth,  v.x)
	let y = Tmath.remap(0, fCanvasHeight, 0, fWorldHeight, v.y)

	// flip y
	y = fWorldHeight - y;
	
	newVec.x = x;
	newVec.y = y;
	return newVec
    } else {
	let newVec = new Box2D.b2Vec2()
	
	let x = Tmath.remap(0, fCanvasWidth,  0, fWorldWidth,  v.get_x())
	let y = Tmath.remap(0, fCanvasHeight, 0, fWorldHeight, v.get_y())

	// flip y
	y = fWorldHeight - y;
	
	newVec.Set(x,y);
	return newVec	
    }
}

function world2pixels_vec(v)
{
    if (usePlanck) {
	let newVec = planck.Vec2()

	let x = Tmath.remap(0, fWorldWidth,  0, fCanvasWidth,  v.x)
	let y = Tmath.remap(0, fWorldHeight, 0, fCanvasHeight, v.y)

	// flip y
	y = fCanvasHeight - y;
	
	newVec.x = x;
	newVec.y = y;
	return newVec
    } else {
	let newVec = new Box2D.b2Vec2()

	let x = Tmath.remap(0, fWorldWidth,  0, fCanvasWidth,  v.get_x())
	let y = Tmath.remap(0, fWorldHeight, 0, fCanvasHeight, v.get_y())
	
	// flip y
	y = fCanvasHeight - y;
	
	newVec.Set(x,y);
	return newVec	
    }
}

function pixels2world_rect(left, top, right, bottom)
{
    if (usePlanck) {
	// swap bottom and top
	//
	let ub = pixels2world_vec(planck.Vec2(left, bottom))
	let lb = pixels2world_vec(planck.Vec2(right, top))

	return {x1: ub.x, y1: ub.y, x2: lb.x, y2: lb.y}
    }
}

class Tbox
{
    _widthPixels;
    _heightPixels;
    _v_pixels;
    _existanceStart;
    _isDynamic;
    _activateOnCollision;
    _sprite;
    _sprite2;

    _body_b2d;
    
    constructor(pos, width, height, existanceStart, isDynamic=true)
    {
	this._widthPixels  = width
	this._heightPixels = height
	this._existanceStart = existanceStart

	if (usePlanck) {
	    this._v_pixels = planck.Vec2(pos[0], pos[1])
	} else {
	    this._v_pixels = new Box2D.b2Vec2(pos[0], pos[1])
	}
	this._isDynamic = isDynamic

	this._activateOnCollision = false
	
	// Setup the image in the box.
	//
	this._sprite = new Tsprite(pos)
	this._sprite.setScaleWH(width, height);

	this._sprite2 = new Tsprite2()
	
	this._text = ""
	this._fontSize = 18
	this._fontName = "Avenir"
	
    }

    
    setPosition(newPos)
    {
	if (usePlanck) {
	    this._v_pixels = planck.Vec2(newPos.x, newPos.y)
	    let v_world = pixels2world_vec(this._v_pixels) 
	    this._body_b2d.setPosition(v_world)

	} else {
	    this._v_pixels = new Box2D.b2Vec2(newPos.x, newPos.y)
	    let v_world = pixels2world_vec(this._v_pixels) 
	    this._body_b2d.setPosition(v_world)	    
	}
	
    }

    resize(width, height)
    {
	this._widthPixels  = width
	this._heightPixels = height

	console.log(this._widthPixels, this._heightPixels)
	
	let w = Tmath.remap(0, fCanvasWidth,  0, fWorldWidth,  this._widthPixels)
	let h = Tmath.remap(0, fCanvasHeight, 0, fWorldHeight, this._heightPixels)

	for (let fixture = this._body_b2d.getFixtureList(); fixture; fixture = fixture.getNext()) {

	    this._body_b2d.destroyFixture(fixture)
	}
	
	let shape = planck.Box(w/2, h/2);
	this._body_b2d.createFixture(shape, 1.0);

	if (this._sprite._imgBitmap != null) {

	    if (this._sprite._origFileImage != null) {
		console.log("have an image")
		this._sprite.drawFileOnSprite(this._sprite._origFileImage)
		this._sprite.resizeSprite(this._widthPixels, this._heightPixels)
	    } else {
		//this._sprite.drawFileOnSprite(this._imgBitmap)
	    }
	}

	if (this._sprite2.hasImage()) {

	    console.log("have an image")
	    this._sprite2.resize(this._widthPixels, this._heightPixels)
	}

    }
    
    isDynamic()
    {
	return this._isDynamic
    }

    setStatic()
    {
	this._isDynamic = false
	
	if (usePlanck) {
	    if (this._body_b2d != null) {
		this._body_b2d.setStatic()
	    }
	}
	
    }
    
    setDynamic()
    {
	this._isDynamic = true
	
	if (usePlanck) {
	    if (this._body_b2d != null) {
		this._body_b2d.setDynamic()
	    }
	}
    }

    setActivateOnCollision(activatedState)
    //
    // Description:
    //	   ActivatedOnCollision means that it has experienced at least one collision and then responds to gravity.
    //
    {
	this._activateOnCollision = activatedState	
    }
    
    isActivatedOnCollision()
    {
	return this._activateOnCollision
    }

    
    removeFromSimulation()
    {
	this._body_b2d = null
    }

    isBeingSimulated()
    {
	return this._body_b2d != null
    }
    
    addToSimulation(world)
    {
	if (usePlanck) {
	    let body = world.createBody();

	    if (this._isDynamic) {
		body.setDynamic()
	    } else {
		body.setStatic()
	    }

	    let v_world  = pixels2world_vec(this._v_pixels) 
	    body.setPosition(v_world)
	
	    let w = Tmath.remap(0, fCanvasWidth,  0, fWorldWidth,  this._widthPixels)
	    let h = Tmath.remap(0, fCanvasHeight, 0, fWorldHeight, this._heightPixels)
	    let shape = planck.Box(w/2, h/2);
	    body.createFixture(shape, 1.0);

	    // time to set mass information
            body.setMassData({
		mass: 5,
		center: planck.Vec2(),
		
		// I have to say I do not know the meaning of this "I", but if you set it to zero, bodies won't rotate
		I: 1
	    });

	    if (this.isActivatedOnCollision()) {
		body.setGravityScale(1.0)
	    } else {
		body.setGravityScale(0.0)
	    }
	    
	    // Point the box2d object back at Tbox
	    //
	    body.setUserData(this)
	    
	    this._body_b2d = body

	    
	} else {
	    let bd = new Box2D.b2BodyDef();
	    if (this._isDynamic) {
		bd.set_type(2);
	    }
	    let v_world  = pixels2world_vec(this._v_pixels) 
	    bd.set_position(v_world)
	    
	    let body = world.CreateBody(bd);
	    
	    
	    let shape = new Box2D.b2PolygonShape;
	    let w = Tmath.remap(0, fCanvasWidth,  0, fWorldWidth,  this._widthPixels)
	    let h = Tmath.remap(0, fCanvasHeight, 0, fWorldHeight, this._heightPixels)
	    shape.SetAsBox(w/2, h/2);
	    body.CreateFixture(shape, 1.0);

	    this._body_b2d = body
	}
    }

    
    draw(ctx, paused, isSelected=false)
    {
	if (usePlanck) {
	    let pos_world = this._body_b2d.getPosition();
	    let rot       = this._body_b2d.getAngle();
	    let pos_pixels = world2pixels_vec(pos_world)

	    ctx.save()

	    if (this.isDynamic()) {
		this._sprite._rot = -rot
		this._sprite._pos = [pos_pixels.x, pos_pixels.y]
		//this._sprite._pos = [Math.floor(pos_pixels.x), Math.floor(pos_pixels.y)]		
		//this._sprite.draw(ctx)

		this._sprite2._rot = -rot
		this._sprite2._pos = {x:pos_pixels.x, y:pos_pixels.y}
		this._sprite2.draw(ctx)
	    }

	    
	    ctx.beginPath();

	    if (isSelected == true) {
		ctx.lineWidth = 1.5;
	    } else {
		ctx.lineWidth = 0.5;
	    }
	    
	    if (this.isDynamic()) {
		ctx.strokeStyle = 'black';
	    } else {
		ctx.strokeStyle = 'grey';	    
	    }

	    if (!paused) {
		//if (this._sprite._imgBitmap == null) {
		if (this._sprite2._img == null) {		    
		    this.drawRect(ctx, pos_pixels, rot);
		}
	    } else {
		this.drawRect(ctx, pos_pixels, rot);
	    }

	    ctx.restore()
	    
	} else {
	    let pos_world = this._body_b2d.GetPosition();
	    let rot       = this._body_b2d.GetAngle();
	    let pos_pixels = world2pixels_vec(pos_world)

	    if (this.isDynamic()) {
		this._sprite._rot = -rot
		this._sprite._pos = [pos_pixels.get_x(), pos_pixels.get_y()]
		this._sprite.draw(ctx)
	    }
	    
	    ctx.beginPath();
	    ctx.lineWidth = 1;

	    
	    if (this.isDynamic()) {
		ctx.strokeStyle = 'black';
	    } else {
		ctx.strokeStyle = 'grey';	    
	    }

	    if (!paused) {
		if (this._sprite._imgBitmap == null) {
		    this.drawRect(ctx, pos_pixels, rot);
		}
	    } else {
		this.drawRect(ctx, pos_pixels, rot);
	    }
	}
    }

    intersects(mousePos)
    {
	let v_world  = pixels2world_vec(mousePos)

	if (usePlanck) {
	    // loop through all fixtures
            for (let fixture = this._body_b2d.getFixtureList(); fixture; fixture = fixture.getNext()) {
 
		if (fixture.testPoint(v_world)) {
                    return true;
		}
	    }
	} else {
	    let fList = this._body_b2d.GetFixtureList()

	    while (fList["e"] != 0) {
		
		if (fList.TestPoint(v_world)) {
                    return true;
		}
		
		fList = fList.GetNext()
	    }
	}
    }

    intersectRect(rect)
    //
    // Description:
    //	    Tests if the box is in the rectangle.
    //

    {
	if (usePlanck) {
	    // loop through all fixtures
            for (let fixture = this._body_b2d.getFixtureList(); fixture; fixture = fixture.getNext()) {

		let shape = fixture.getShape();

		let numChildren = shape.getChildCount()
		
		for (let i=0; i < numChildren; i++) {
		    let aabb = fixture.getAABB(i)

		    let boxRect = {x1: aabb.lowerBound.x, y1: aabb.lowerBound.y,
				   x2: aabb.upperBound.x, y2: aabb.upperBound.y}
		    
		    
		    return TdrawUtils.overlaps(rect, boxRect)
		}
	    }
	}
	return false
    }

    drawRect(ctx, p_pixels, angle)
    {
	if (usePlanck) {
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
    	} else {
	    let xformMat = Tmath.xformMatrix(-angle, [p_pixels.get_x(), p_pixels.get_y()])

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
    }

    drawStrokeOnSprite(stroke)
    {
	// transform the stroke points to the coordinates on the image.
	//

	let bCenter = this.getCenterInPixels()
	let left = bCenter.x - this._widthPixels/2
	let top  = bCenter.y - this._heightPixels/2

	// Need to clone this as translating will affect stroke
	//
	let s = stroke.clone()
	s.translate(left, top)
	
	this._sprite.drawStrokeOnSprite(s)

	if (!this._sprite2.hasImage()) {
	    this._sprite2.initBitmap(this._widthPixels, this._heightPixels)
	}
	this._sprite2.drawStrokeOnBitmap(s)
    }

    getCenterInPixels()
    {
	if (usePlanck) {
	    // Probably should rotate the object and then find the center but
	    // this is simpler for now.
	    //
	    let pos_world  = this._body_b2d.getPosition();
	    let pos_pixels = world2pixels_vec(pos_world)
	    
	    let xCenter = pos_pixels.x
	    let yCenter = pos_pixels.y
	    
	    return {x:xCenter, y:yCenter}
	} else {
	    let pos_world  = this._body_b2d.GetPosition();
	    let pos_pixels = world2pixels_vec(pos_world)
	    
	    let xCenter = pos_pixels.get_x()
	    let yCenter = pos_pixels.get_y()
	    
	    return {x:xCenter, y:yCenter}
	}
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

class Tjoint
{
    _box1;
    _box1Pos;
    _box2;
    _box2Pos;
    
    _existanceStart;

    _joint_b2d;
    
    constructor(b1, b1Pos, b2, b2Pos, existanceStart)
    {
	this._box1 = b1
	this._box2 = b2
	this._box1Pos = b1Pos
	this._box2Pos = b2Pos
	
	this._existanceStart = existanceStart
	
	if (usePlanck) {
	} else {
	    //this._v_pixels = new Box2D.b2Vec2(pos[0], pos[1])
	}
    }

    addToSimulation(world)
    {
	if (usePlanck) {

	    var worldAnchorOnA = planck.Vec2(this._box1Pos.x, this._box1Pos.y)
	    var worldAnchorOnB = planck.Vec2(this._box2Pos.x, this._box2Pos.y)

	    worldAnchorOnA = pixels2world_vec(worldAnchorOnA)
	    worldAnchorOnB = pixels2world_vec(worldAnchorOnB)

	    console.log(worldAnchorOnA)
	    console.log(worldAnchorOnB)

	    //var anchor = planck.Vec2(this._box1._body_b2d.getPosition(),
	    //this._box2._body_b2d.getPosition())
	    //var anchor = planck.Vec2(b1Pos, b2Pos)
	    //anchor.x = 0
	    //anchor.y = 0
	    //anchor = b1Pos - b2Pos
	    //console.log(anchor)

	    /*

	    let j = world.createJoint(planck.RevoluteJoint({
		collideConnected: false,
	    }, this._box1._body_b2d, this._box2._body_b2d, anchor))
	    */

	    let j = world.createJoint(planck.DistanceJoint({
		collideConnected: false,
	    }, this._box1._body_b2d, this._box2._body_b2d, worldAnchorOnA, worldAnchorOnB))

	    
	    this._joint_b2d = j
	}
    }
    
    removeFromSimulation()
    {
	this._joint_b2d = null
    }

    isBeingSimulated()
    {
	return this._joint_b2d != null
    }
    
    draw(ctx, paused)
    {
	if (usePlanck) {

	    
	    var a1 = world2pixels_vec(this._joint_b2d.getBodyA().getPosition())
	    var a2 = world2pixels_vec(this._joint_b2d.getBodyB().getPosition())

	    a1 = world2pixels_vec(this._joint_b2d.getAnchorA())
	    a2 = world2pixels_vec(this._joint_b2d.getAnchorB())	    

	    
	    //let pos_pixels1 = world2pixels_vec(b1)
	    //let pos_pixels2 = world2pixels_vec(b1)	    
	    
	    
	    //let a1 = world2pixels_vec(this._joint_b2d.getAnchorA())
	    //let a2 = world2pixels_vec(this._joint_b2d.getAnchorB())

	    
	    ctx.beginPath();
	    ctx.lineWidth = .5;
	    ctx.strokeStyle = 'grey';	    

	    ctx.beginPath();
	    ctx.moveTo(a1.x, a1.y)
	    ctx.lineTo(a2.x, a2.y)
	    ctx.stroke();
	}
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


	this._fObjectList  = []
	this._fJointList   = []

	if (usePlanck) {
	    this._fGravity = planck.Vec2(0, -10);
	    this._fWorld   = planck.World(this._fGravity);



	    
	} else {
	    this._fGravity = new Box2D.b2Vec2(0, -10);
	    this._fWorld   = new Box2D.b2World(this._fGravity);
	}
	
	this._defFontSize = 18
	this._defFontName = "Avenir"

    }
    
    addBox(pos, width, height, frame, isDynamic=true)
    {
	let box = new Tbox(pos, width, height, frame, isDynamic);
	this._fObjectList.push(box)

	return box
    }

    addBoxWithTexture(pos, frame, textureFilename, isDynamic=true)
    {

	var addTextureBox_fileLoad = function(e)  {


	    let img = e["target"]

	    let width  = img.width
	    let height = img.height
	    
	    let box = new Tbox(pos, width, height, frame, isDynamic);
	    this._fObjectList.push(box)

	    
	    box._sprite.setOrigFileImage(img)
	    box._sprite.drawFileOnSprite(img)

	    box._sprite2.initBitmapWithImage(img, width, height)

	    
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

    addBox2(params)
    {
	// pull the params.
	//
	let isDynamic = true
	if (params.hasOwnProperty('isDynamic')) {
	    isDynamic = params['isDynamic']
	}

	let pos = [50,50]
	if (params.hasOwnProperty('pos')) {
	    pos = params['pos']
	}

	let frame = 0
	if (params.hasOwnProperty('frame')) {
	    frame = params['frame']
	}

	let image = null
	if (params.hasOwnProperty('image')) {
	    image = params['image']
	}

	if (image != null) {
	    let width  = image.width
	    let height = image.height

	    let ratio = window.devicePixelRatio

	    
	    if (ratio >= 1) {
		width  = width  / ratio
		height = height / ratio
	    } else {
		ratio = 1
	    }
	    
	    //pos[0] = 500
	    //pos[1] = 500
	    

	    let box = new Tbox(pos, width, height, frame, isDynamic)


	    
	    //box._sprite.setOrigFileImage(image)
	    //box._sprite.drawFileOnSprite(image)

	    box._sprite2.initBitmap(image, 1/ratio)
	    
	    this._fObjectList.push(box)
	    
	    // hack- this is done in Tcanvas normally but hacking it here
	    // loading the file is delayed so easier to do it here as we
	    // know the file is loaded.
	    //
	    this.setFrame(frame)

	    return box
	}	
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

	
	if (!box._sprite2.hasImage()) {
	    box._sprite2.initBitmap(bWidth, bHeight)
	}
	box._sprite2.drawTextOnBitmap(text, font, fontSize)	

	return box
    }


    scissors(b, verticalSplits, horizontalSplits, frame, isDynamic=true)
    {
	let retBoxes = []
	if (verticalSplits.length > 0) {
	    


	    let boxCenter = b.getCenterInPixels()

	    let x1 = boxCenter.x - b._widthPixels/2
	    let y1 = boxCenter.y - b._heightPixels/2

	    let left = x1
	    let top  = y1

	    /*
	    let xDivisions = horizontalSplits.length
	    let yDivisions = verticalSplits.length

	    let numBoxes = (xDivisions+1) * (yDivisions+1)
	    console.log(numBoxes)
	    */

	    horizontalSplits.push(boxCenter.x + b._widthPixels/2)
	    verticalSplits.push  (boxCenter.y + b._heightPixels/2)
	    
	    console.log(verticalSplits)
	    console.log(horizontalSplits)	    
	    for (const y2 of verticalSplits) {

		for (const x2 of horizontalSplits) {
		    // Make a box using coordinates x1,y1 --> x2,y2
		    //
		    console.log("coords")
		    console.log(x1,y1,x2,y2)

		    const bWidth  = x2-x1
		    const bHeight = y2-y1

		    if (bWidth > 0 && bHeight > 0) {

			let centerX = x1 + bWidth/2
			let centerY = y1 + bHeight/2
			let box = new Tbox([centerX,centerY], bWidth, bHeight, frame, isDynamic);
			this._fObjectList.push(box)
			
			
			
			if (b._sprite2.hasImage()) {
			    let scaleFactor_inverse = Math.floor(1 / b._sprite2.scaleFactor())
			    
			    let cropImage = Timage.crop(b._sprite2._img,
							(x1-left) * scaleFactor_inverse,
							(y1-top)  * scaleFactor_inverse, 
							(x2-left) * scaleFactor_inverse,
							(y2-top)  * scaleFactor_inverse)
			
			    console.log("this is the original dimensions: " +
					b._sprite2._img.width + " " +
					b._sprite2._img.height)
			    console.log("this is the crop dimensions: " + cropImage.width, cropImage.height)
			    box._sprite2.initBitmap(cropImage, b._sprite2.scaleFactor())
			}
			

			retBoxes.push(box)
		    }
		    x1 = x2
		}
		x1 = boxCenter.x - b._widthPixels/2
		y1 = y2
	    }
	}

	return retBoxes
    }


    scissors_horizontal(b, horizontalSplits, frame, isDynamic=true)
    {
	let retBoxes = []
	if (horizontalSplits.length > 0) {


	    let r = Trect.constructFromCenterWidthHeight(b.getCenterInPixels(),
							 b.widthInPixels(),
							 b.heightInPixels())

	    let coords_x2s = horizontalSplits
	    coords_x2s.push(r._x2)

	    let cutRect = new Trect()
	    cutRect._x1 = r._x1
	    cutRect._y1 = r._y1
	    cutRect._y2 = r._y2
	    
	    for (const x2 of coords_x2s) {

		cutRect._x2 = x2

		if (cutRect.width() > 0 && cutRect.height() > 0) {

		    let box = new Tbox([cutRect.center().x,cutRect.center().y],
				       cutRect.width(), cutRect.height(), frame, isDynamic);
		    console.log(box)
		    
		    this._fObjectList.push(box)
			
		    if (b._sprite2.hasImage()) {
			let scaleFactor_inverse = Math.floor(1 / b._sprite2.scaleFactor())
			    
			let cropImage = Timage.crop(b._sprite2._img,
						    (cutRect._x1-r._x1) * scaleFactor_inverse,
						    (cutRect._y1-r._y1) * scaleFactor_inverse, 
						    (cutRect._x2-r._x1) * scaleFactor_inverse,
						    (cutRect._y2-r._y1) * scaleFactor_inverse)
			
			box._sprite2.initBitmap(cropImage, b._sprite2.scaleFactor())
		    }
		    retBoxes.push(box)
		}
		cutRect._x1 = x2
	    }
	}

	return retBoxes	
    }
    
    
    split(b, frame, isDynamic=true)
    {
	let retBoxes = []
	if (b._text != "") {
	    retBoxes = this.splitIntoWordBoxes(b, frame, isDynamic)
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


		    /*
		    if (b._sprite._imgBitmap != null) {
			var setBoxBitmap = function(bm) {
			    this._sprite._imgBitmap = bm		
			}

			let boundBitmapFunction = setBoxBitmap.bind(box)
	    
			// Extract the bitmap for this rect.
			//
			b._sprite.extractBitmap(spriteXCoord, spriteYCoord, spriteXCoord+bWidth, spriteYCoord+bHeight, boundBitmapFunction)

		    }
		    */

		    if (b._sprite2.hasImage()) {


			// Compute the coordinates to crop the image.
			//


			// FUTURE: Change Timage to TimageUtils
			//
			let scaleFactor_inverse = Math.floor(1 / b._sprite2.scaleFactor())


			/*
			let cropImage = Timage.crop(b._sprite2._img,
						    spriteXCoord * scaleFactor_inverse,
						    spriteYCoord * scaleFactor_inverse,
						    (spriteXCoord + bWidth)  * scaleFactor_inverse,
						    (spriteYCoord + bHeight) * scaleFactor_inverse)
			*/
			let cropImage = Timage.crop(b._sprite2._img,
						    spriteXCoord * scaleFactor_inverse,
						    spriteYCoord * scaleFactor_inverse, 
						    (spriteXCoord + bWidth)  * scaleFactor_inverse,
						    (spriteYCoord + bHeight) * scaleFactor_inverse)
			
			console.log("this is the original dimensions: " +
				    b._sprite2._img.width + " " +
				    b._sprite2._img.height)
			console.log("this is the crop dimensions: " + cropImage.width, cropImage.height)
			box._sprite2.initBitmap(cropImage, b._sprite2.scaleFactor())

			//box._sprite2.snipOrigImage(spriteXCoord, spriteYCoord, spriteXCoord+bWidth, spriteYCoord+bHeight)
		    }
		    xCoord       = xCoord       + bWidth
		    spriteXCoord = spriteXCoord + bWidth


		    retBoxes.push(box)

		    
		}
		xCoord = left   + bWidth/2
		yCoord = yCoord + bHeight

		spriteXCoord = 0
		spriteYCoord = spriteYCoord + bHeight
	    }
	}

	return retBoxes
    }
    
    splitIntoWordBoxes(b, frame, isDynamic=true)
    {
	let retBoxes = []
	
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

	    /*
	    var setBoxBitmap = function(bm) {
		this._sprite._imgBitmap = bm		
	    }

	    let boundBitmapFunction = setBoxBitmap.bind(box)
	    
	    // Extract the bitmap for this rect.
	    //
	    b._sprite.extractBitmap(r.x, r.y, r.x+r.w, r.y+r.h, boundBitmapFunction)
	    */

	    let extractedBitmap = b._sprite2.extractBitmap(r.x, r.y, r.x+r.w, r.y+r.h)
	    box._sprite2.initBitmapWithBitmap(extractedBitmap)

	    this._fObjectList.push(box)

	    retBoxes.push(box)
	}

	return retBoxes
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
	    //this.addBoxWithText( [xCoord,yCoord], r.w, frame, w, font="Avenir", fontSize=18, isDynamic=true)
	    this.addBoxWithText( [xCoord,yCoord], r.w, frame, w, font=font, fontSize=fontSize, isDynamic=true)


	    //this.addBox([xCoord,yCoord], r.w, r.h, frame, isDynamic)
	}
    }


    addJoint(box1, box1Pos, box2, box2Pos, frame)
    {
	console.log("ADDD JOINT")
	let joint = new Tjoint(box1, box1Pos, box2, box2Pos, frame)
	this._fJointList.push(joint)
    }

    
    step()
    {
	if (usePlanck) {
	    this._fWorld.step(1/60, 8, 3);

	    // crearForces  method should be added at the end on each step
            this._fWorld.clearForces();
	} else {
	    this._fWorld.Step(1/60, 8, 3);
	}

    }

    
    draw(ctx, paused)
    {
	for (const b of this._fObjectList) {	
	    // Check to see if it's part of the world.
	    //
	    if (b.isBeingSimulated()) {
		b.draw(ctx, paused)
	    }
	}

	for (const j of this._fJointList) {	
	    // Check to see if it's part of the world.
	    //
	    if (j.isBeingSimulated()) {
		j.draw(ctx, paused)
	    }
	}
    }

    reset()
    {
	if (usePlanck) {
	    this._fWorld = null
	    this._fWorld   = planck.World(this._fGravity);

	    
	    
	    this._fWorld.on('pre-solve', function(contact, oldManifold) {
		var manifold = contact.getManifold();
        
		if (manifold.pointCount == 0) {
		    return;
		}

		let bodyA = contact.getFixtureA().getBody();
		let bodyB = contact.getFixtureB().getBody();

		//let vA = bodyA.getLinearVelocityFromWorldPoint(point);
		//let vB = bodyB.getLinearVelocityFromWorldPoint(point);

		//let approachVelocity = Vec2.dot(vB -- vA, worldManifold.normal); //[todo]

		
		let vA = bodyA.getLinearVelocity()
		let vB = bodyB.getLinearVelocity()

		/*
		let state1 = []; // [PointState]
		let state2 = []; // [PointState]
		manifold.getPointStates(state1, state2, oldManifold, contact.getManifold());

		console.log(state1)
		*/
		//let vA = bodyA.getLinearVelocityFromWorldPoint(point);
		//let vB = bodyB.getLinearVelocityFromWorldPoint(point);

		//let approachVelocity = Vec2.dot(vB -- vA, worldManifold.normal); //[todo]


		if (vA.x < 0.0001 && vA.y < 0.001 && vB.x < 0.001 && vB.y < 0.001) {

		} else {
		    bodyA.setGravityScale(1.0)
		    bodyB.setGravityScale(1.0)
		    let boxA = bodyA.getUserData()
		    let boxB = bodyB.getUserData()
		}
	    });
	    


	} else {
	    this._fWorld = null
	    this._fWorld   = new Box2D.b2World(this._fGravity);
	}

	for (const b of this._fObjectList) {
	    b.removeFromSimulation()	    
	}

	for (const j of this._fJointList) {
	    j.removeFromSimulation()	    
	}
	
    }
    
    setFrame(f)
    {
        for (const b of this._fObjectList) {
	    if (b._existanceStart == f) {
		b.addToSimulation(this._fWorld)
	    }
	}
        for (const j of this._fJointList) {
	    if (j._existanceStart == f) {
		j.addToSimulation(this._fWorld)
	    }
	}
    }

    intersects(mousePos)
    //
    // Description:
    //	    Tests which boxes are behing the mouse position 'p'
    //
    {
	if (usePlanck) {
	    let m = planck.Vec2(mousePos[0], mousePos[1])
	    
            for (const b of this._fObjectList) {		
		if (b.isBeingSimulated()) {
		    if (b.intersects(m)) {
			return b
		    }
		}
	    }
	} else {
	    let m = new Box2D.b2Vec2(mousePos[0], mousePos[1])

            for (const b of this._fObjectList) {
		if (b.isBeingSimulated()) {
		    if (b.intersects(m)) {
			return b
		    }
		}
	    }
	}

	return null

    }

    intersectRect(left, top, right, bottom)
    //
    // Description:
    //	    Tests which boxes are in the rectangle defined by (left,top,right,bottom)
    //
    {
	let p1 = pixels2world_vec(planck.Vec2(left, top))
	let p2 = pixels2world_vec(planck.Vec2(right, bottom))

	let r1 = pixels2world_rect(left, top, right, bottom)

	let boxes = []
	if (usePlanck) {
            for (const b of this._fObjectList) {		
		if (b.isBeingSimulated()) {

		    if (b.intersectRect(r1)) {
			boxes.push(b)
		    }
		    
		}
	    }
	} 
	return boxes
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

