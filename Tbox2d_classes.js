import Tmath from "./Tmath.js";
import Timage from "./Timage.js";



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
    let newVec = new Box2D.b2Vec2()

    let x = Tmath.remap(0, fCanvasWidth,  0, fWorldWidth,  v.get_x())
    let y = Tmath.remap(0, fCanvasHeight, 0, fWorldHeight, v.get_y())

    // flip y
    y = fWorldHeight - y;
	
    newVec.Set(x,y);
    return newVec	
}

function world2pixels_vec(v)
{
    let newVec = new Box2D.b2Vec2()

    let x = Tmath.remap(0, fWorldWidth,  0, fCanvasWidth,  v.get_x())
    let y = Tmath.remap(0, fWorldHeight, 0, fCanvasHeight, v.get_y())

    // flip y
    y = fCanvasHeight - y;
	
    newVec.Set(x,y);
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
	
	this._v_pixels = new Box2D.b2Vec2(pos[0], pos[1])
	this._isDynamic = isDynamic
	
	// Setup the image in the box.
	//
	this._sprite = new Timage(pos)
	this._sprite.setScaleWH(width, height);
    }

    isStatic()
    {
	return (this._body.GetType() == 0)
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

	this._body = body
    }

    
    draw(ctx)
    {
	let pos_world = this._body.GetPosition();
	let rot       = this._body.GetAngle();

	// map coordinates from world to screen.
	//
	let pos_pixels = world2pixels_vec(pos_world)

	ctx.beginPath();
	ctx.lineWidth = 1;

	if (this.isStatic()) {
	    ctx.strokeStyle = 'red';
	} else {
	    ctx.strokeStyle = 'black';	    
	}
	this.drawRect(ctx, pos_pixels, rot);

	if (!this.isStatic()) {
	    this._sprite._rot = -rot
	    //console.log(pos_pixels.get_x(),pos_pixels.get_y())
	    this._sprite._pos = [pos_pixels.get_x(), pos_pixels.get_y()]
	    //console.log(this._widthPixels, this._heightPixels)
	    this._sprite.draw(ctx)
	}
	
    }

    intersects(mousePos)
    {
	let v_world  = pixels2world_vec(mousePos)

	let fList = this._body.GetFixtureList()

	while (fList["e"] != 0) {

            if (fList.TestPoint(v_world)) {
                return true;
            }
	    
	    fList = fList.GetNext()
	}
    }
    
    drawRect(ctx, p_pixels, angle)
    {
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


    grabImageFromCanvas(canvas)
    {
	console.log("grabImageFromCanvas")

	let pos_world = this._body.GetPosition();
	let rot       = this._body.GetAngle();

	// map coordinates from world to screen.
	//
	let pos_pixels = world2pixels_vec(pos_world)

	
	this._sprite.grabImageFromCanvas(canvas, pos_pixels.get_x(), pos_pixels.get_y(),
					 rot, this._widthPixels, this._heightPixels)
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


	this._boundaryPixels = 10

	this._fObjectList   = []

	this._fGravity = new Box2D.b2Vec2(0, -10);
	this._fWorld   = new Box2D.b2World(this._fGravity);
    }
    
    addBox(pos, width, height, frame, isDynamic=true)
    {
	let box = new Tbox(pos, width, height, frame, isDynamic);
	this._fObjectList.push(box)
    }

    addBoxWithTexture(pos, width, height, frame, textureFilename, isDynamic=true)
    {
	console.log('adding box with texture')

	
	let box = new Tbox(pos, width, height, frame, isDynamic);
	this._fObjectList.push(box)

	var setBoxSize = function(width, height) {
	    box._widthPixels = width
	    box._heightPixels = height
	    
	    console.log("setBoxSize %d %d", width, height)
	}
	

	//let boundSetBoxSize = setBoxSize.bind(this)
	//box._sprite.imageFromFile(textureFilename, boundSetBoxSize)

	box._sprite.imageFromFile(textureFilename, setBoxSize)	
    }

    step()
    {
	//console.log(fWorld.GetGravity().get_x(),fWorld.GetGravity().get_y()) 
	this._fWorld.Step(1/60, 8, 3);
	
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
	this._fWorld   = new Box2D.b2World(this._fGravity);

	
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

	// Add bottom boundary.
	//
	this.addBox( [fCanvasWidth/2,fCanvasHeight-this._boundaryPixels/2], fCanvasWidth, this._boundaryPixels, 0, false );

	this.addBox( [fCanvasWidth/2,25], 50, 50, 0, false);	
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
	let m = new Box2D.b2Vec2(mousePos[0], mousePos[1])

        for (const b of this._fObjectList) {

	    if (b.isBeingSimulated()) {

		if (b.intersects(m)) {

		    console.log("found an intersection")
		    return b
		}
	    }
	}

	return null

    }
}

export default Tbox2d_world

