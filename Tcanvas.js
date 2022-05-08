import Tstroke      from "./Tstroke.js";
import Tbox2d_world from "./Tbox2d_classes.js";
import Timage       from "./Timage.js";
import Tevent       from "./Tevent.js";

import Ttouch	    from "./Ttouch.js";


class Tcanvas
{
    _pauseAnim     = true

    // These are the new ones....
    _currentFrame   = 0
    _totalNumFrames = 0

    _frameChangeEvent      = new Tevent()
    _frameRangeChangeEvent = new Tevent()

    constructor(canvasDocName) {
	this.fCanvas  = document.getElementById(canvasDocName)
	this.fContext = this.fCanvas.getContext('2d')

	this._isDrawingObject   = false
	this._isDrawingTexture  = false	

	this._drawingTargetObject = null

	// list of points that represent the drawing stroke.
	//
	this.fCurrentStroke = new Tstroke()

	this._canvasWidth = function() {

	    return this.fCanvas.width
	}

	this._canvasHeight = function() {
	    return this.fCanvas.height
	}
	
	this.fCanvas.addEventListener('touchstart', (e) => {
	    this.mouseDown(e)
	});
	this.fCanvas.addEventListener('mousedown', (e) => {
	    this.mouseDown(e)
	});
	
	this.fCanvas.addEventListener('mousemove', (e) => {
	    this.mouseMove(e);
	});

	this.fCanvas.addEventListener('touchmove', (e) => {
	    this.mouseMove(e);
	});
	
	window.addEventListener('mouseup', (e) => {
	    this.mouseUp(e);

	});

	window.addEventListener('touchend', (e) => {
	    this.mouseUp(e);

	});
	window.addEventListener('touchleave', (e) => {
	    this.mouseUp(e);

	});

	this.fCanvas.addEventListener('drop', (e) => {
	    this.onDrop(e);
	});

	this.fCanvas.addEventListener('dragover', (e) => {
	    this.onDragOver(e);
	});

	this.fCanvas.addEventListener('dragenter', (e) => {
	    this.onDragEnter(e);
	});

	
	// Test to draw an image.
	//
	this._testSprite = new Timage([this._canvasWidth()/2, this._canvasHeight()/2]);
	this._testSprite.setScaleWH(100,200)
	//this._testSprite.setScale(100)
    }

    init() {
	this.setFrameRange(30*5) // 30fps * 5 seconds = 150 frames
	
	window.requestAnimationFrame(this.draw);


	this._box2dWorld = new Tbox2d_world(this._canvasWidth(), this._canvasHeight())

	// Add bottom boundary.
	//
	let boundaryPixels = 10
	this._box2dWorld.addBox( [this._canvasWidth()/2,this._canvasHeight()-boundaryPixels/2], this._canvasWidth(), boundaryPixels, 0, false );

	//this.addBox( [fCanvasWidth/2,25], 50, 50, 0, false);	



	this.setFrame(0)
    }

    draw = () => {

	if (!this._pauseAnim) {

	    this._box2dWorld.step()
	    let frameNum = this.getCurrentFrame() + 1
	    this.setFrame(frameNum)
	}
	
	this.fContext.setTransform(1, 0, 0, 1, 0, 0);
	
	this.fContext.clearRect(0, 0, this._canvasWidth(), this._canvasHeight())
	
	this.fCurrentStroke.draw(this.fContext)

	this._box2dWorld.draw(this.fContext)


	// Test code to rotate an image.
	//
	//this._testSprite.draw(this.fContext)
	

	/*

	this._fps = 1 / ((performance.now() - this._lastFrameTime) / 1000);
	this._lastFrameTime = TIME
*/

	
	window.requestAnimationFrame(this.draw);

    }
    
    mouseDown(e)
    {
	let touchInfo = Ttouch.getTouch(e)

	let x = touchInfo.x
	let y = touchInfo.y
	
	const output = document.getElementById("output")
	output.textContent = 'info2 = ' + x + ' ' + y
	
	
	let b = this._box2dWorld.intersects([x,y])
	
	if (b == null) {
	    this._isDrawingObject = true
	    
	} else {	

	    this._isDrawingTexture = true

	    this._drawingTargetObject = b
	}
	this.fCurrentStroke.push([x,y], touchInfo.pressure)
    }
    
    mouseUp(e)
    {

	if (!this._isDrawingObject && !this._isDrawingTexture) {
	    return
	}

	const output = document.getElementById("output")

	output.textContent = 'here'

	if (this._isDrawingObject) {

	    // Figure out the box.
	    //
	    let box = this.fCurrentStroke.axisAlignedBox()
	    if (box != null) {
		let center = box['center'];
		let width  = box['width'];
		let height = box['height'];

		this._box2dWorld.addBox(center, width, height, this.getCurrentFrame())		
	    }
	    
	    // Reset the stroke.
	    //
	    this.fCurrentStroke.clear()

	    this._isDrawingObject = false
	} else if (this._isDrawingTexture) {

	    // Reset the stroke.
	    //
	    this.fCurrentStroke.clear()

	    this._isDrawingTexture = false	    
	    
	    this._drawingTargetObject.grabImageFromCanvas(this.fCanvas)
	}

	if (this._pauseAnim) {
	    this.setFrame(this._currentFrame)
	}
    }


    mouseMove(e)
    {
	if (!this._isDrawingObject && !this._isDrawingTexture) {
	    return
	}

	let touchInfo = Ttouch.getTouch(e)

	let x = touchInfo.x
	let y = touchInfo.y
	
	e.preventDefault()


	this.fCurrentStroke.push([x,y], touchInfo.pressure)	
    }

    onDrop(e)
    {
	e.preventDefault()

	//const lines = e.dataTransfer.getData("text/uri-list").split("\n");


	const fileList = e.dataTransfer.files;

	var droppedHTML = e.dataTransfer.getData("text/html");

	var rex = /src="?([^"\s]+)"?\s*/;
	var url, res;
	url = rex.exec(droppedHTML);

	let center = [e.offsetX, e.offsetY]
	let width  = 100
	let height = 100

	
	this._box2dWorld.addBoxWithTexture(center, width, height, this.getCurrentFrame(), url[1])


	/*
	for (const f of fileList) {

	    let center = [e.offsetX, e.offsetY]
	    let width  = 100
	    let height = 100


	    this._box2dWorld.addBoxWithTexture(center, width, height, this.getCurrentFrame(), f.name)
	    //this._box2dWorld.addBox(center, width, height, this.getCurrentFrame())

	    console.log(f.name)
	    
	}
	*/


	
	// Have to do this so the box gets added to the simulation.
	// kind of a hack.
	//
	if (this._pauseAnim) {
	    this.setFrame(this._currentFrame)
	}
    }

    onDragOver(e)
    {
	
	e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	
	e.preventDefault()
    }
    onDragEnter(e)
    {
	e.preventDefault()
    }

    setFrame(f)
    {
	this._currentFrame = f
	//console.log( 'The data: %d', this._currentFrame )

	if (this._currentFrame >= this._totalNumFrames) {
	    this._box2dWorld.reset()
            this._currentFrame = 0
        } else if (this._currentFrame <= 0) {
	    this._box2dWorld.reset()
            this._currentFrame = 0
        }

        // Add the bodies.
        //
	this._box2dWorld.setFrame(this._currentFrame)

	this._frameChangeEvent.trigger(this._currentFrame);
    }

    setFrameRange(fr)
    {
	this._totalNumFrames = fr
	this._frameRangeChangeEvent.trigger(this._totalNumFrames);
    }
    
    getCurrentFrame()
    {
	return this._currentFrame
    }

    setSimulationDuration(durationInFrames)
    {
	this._totalNumFrames = durationInFrames
    }

    getDurationInFrames()
    {
	return this._totalNumFrames
    }
}

export default Tcanvas;
