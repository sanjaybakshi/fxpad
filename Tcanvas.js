import Tstroke      from "./Tstroke.js";
import Tbox2d_world from "./Tbox2d_classes.js";
import Timage       from "./Timage.js";
import Tevent       from "./Tevent.js";

import Ttouch	    from "./Ttouch.js";

import Ttoolbar_objects from "./Ttoolbar_objects.js";
import Ttoolbar_box     from "./Ttoolbar_box.js";
import TtextBox         from "./TtextBox.js";


class Tcanvas
{
    _pauseAnim     = true

    // These are the new ones....
    _currentFrame   = 0
    _totalNumFrames = 0

    _frameChangeEvent      = new Tevent()
    _frameRangeChangeEvent = new Tevent()

    kDrawObject  = 0
    kDrawTexture = 1
    kXformObject = 2
    kDrawJoint   = 3
    
    
    constructor(canvasDocName) {
	this.fCanvas  = document.getElementById(canvasDocName)


	/*
	// make a hirez canvas.
	// https://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas
	//
	let ratio = window.devicePixelRatio

	console.log("The ratio is: " + ratio)
	
	//window.devicePixelRatio = 2
	
	this.fCanvas.width  = this.fCanvas.style.width  * ratio
	this.fCanvas.height = this.fCanvas.style.height * ratio
	*/
	this.fContext = this.fCanvas.getContext('2d')
	//this.fContext.scale(ratio,ratio)
	
	this._fToolbar_box     = new Ttoolbar_box("toolbar.boxId", this)
	this._fToolbar_objects = new Ttoolbar_objects("toolbar.objectsId", this)	

	this._fToolbar_objects.show()
	
	this._fTextBox = new TtextBox("dragDropWindow")

	this._toolMode = this.kDrawObject;
	this._selectedObject = null

	this._strokeStarted = false

	
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
	//this._testSprite = new Timage([this._canvasWidth()/2, this._canvasHeight()/2]);
	//this._testSprite.setScaleWH(100,200)
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
	

	this._box2dWorld.draw(this.fContext, this._pauseAnim)

	this.fCurrentStroke.draw(this.fContext)

	if (this._pauseAnim) {

	    if (!this._fToolbar_objects.draw(this.fContext)) {
		if (this._toolMode == this.kXformObject) {
		    this._fToolbar_box.draw(this.fContext, [this._selectedObject])
		}
	    }
	}

	
	// Test code to rotate an image.
	//
	//this._testSprite.draw(this.fContext)
	

	/*

	this._fps = 1 / ((performance.now() - this._lastFrameTime) / 1000);
	this._lastFrameTime = TIME
*/

	// Draw text for debugging.
	//
	this.fContext.font = '18px ' + 'Avenir'
	this.fContext.textBaseline = 'top';
	this.fContext.fillText('ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz Sanjay Dutt', 100,100)


	window.requestAnimationFrame(this.draw);

    }

    mouseDown(e)
    {
	if (!this._fToolbar_objects.mouseDown(e)) {

	    if (this._toolMode == this.kDrawObject) {
		this.mouseDown_Object(e)
	    } else if (this._toolMode == this.kDrawTexture) {
		this.mouseDown_Texture(e)
	    } else if (this._toolMode == this.kXformObject) {
		this._fToolbar_box.mouseDown(e, [this._selectedObject])
	    }
	}
    }

    mouseUp(e)
    {
	if (!this._fToolbar_objects.mouseUp(e)) {
	    if (this._toolMode == this.kDrawObject) {
		this.mouseUp_Object(e)
	    } else if (this._toolMode == this.kDrawTexture) {
		this.mouseUp_Texture(e)
	    } else if (this._toolMode == this.kXformObject) {
		this._fToolbar_box.mouseUp(e,[this._selectedObject])
	    }
	}

    }

    mouseMove(e)
    {
	if (!this._fToolbar_objects.mouseMove(e)) {
	    if (this._toolMode == this.kDrawObject) {
		this.mouseMove_Object(e)
	    } else if (this._toolMode == this.kDrawTexture) {
		this.mouseMove_Texture(e)
	    } else if (this._toolMode == this.kXformObject) {
		this._fToolbar_box.mouseMove(e,[this._selectedObject])
	    }
	}
    }
    
    mouseDown_Object(e)
    {
	let touchInfo = Ttouch.getTouch(e)

	let x = touchInfo.x
	let y = touchInfo.y

	let b = this._box2dWorld.intersects([x,y])
	
	if (b == null) {
	
	    this._strokeStarted = true
	    this.fCurrentStroke.push([x,y], touchInfo.pressure)

	    if (this._fToolbar_box.isVisible()) {
		this._fToolbar_box.hide()
	    }
	} else {

	    // selecting an object (not drawing an object).
	    //
	    if (! this._fToolbar_box.isVisible() || b != this._selectedObject) {


		// get the center of the box.
		//
		let bCenter = b.getCenterInPixels()
		
		// These coordinates are relative to the canvas.
		// Need to convert them to the window.
		//
		let r = this.fCanvas.getBoundingClientRect()
		let canvasX = r.left
		let canvasY = r.top
		
		// 
		let xP = (bCenter.x - b.widthInPixels()/2)  + canvasX
		let yP = (bCenter.y + b.heightInPixels()/2) + canvasY

		this._fToolbar_box.showAt([xP,yP])

		this._selectedObject = b;
		
	    }	    
	}
    }

    mouseDown_Texture(e)
    {
	let touchInfo = Ttouch.getTouch(e)

	let x = touchInfo.x
	let y = touchInfo.y

	this._strokeStarted = true
	this.fCurrentStroke.push([x,y], touchInfo.pressure)
	
    }

    mouseMove_Object(e)
    {
	if (this._strokeStarted) {
	
	    let touchInfo = Ttouch.getTouch(e)
	    
	    let x = touchInfo.x
	    let y = touchInfo.y
	    
	    this.fCurrentStroke.push([x,y], touchInfo.pressure)
	}
    }
    
    mouseMove_Texture(e)
    {
	if (this._strokeStarted) {

	    let touchInfo = Ttouch.getTouch(e)

	    let x = touchInfo.x
	    let y = touchInfo.y
	
	    e.preventDefault()


	    this.fCurrentStroke.push([x,y], touchInfo.pressure)
	}
    }
    mouseUp_Object(e)
    {
	if (this._strokeStarted) {
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
	}
	this._strokeStarted = false

	if (this._pauseAnim) {
	    this.setFrame(this._currentFrame)
	}
    }
    
    mouseUp_Texture(e)
    {
	if (this._strokeStarted) {

	    this._selectedObject.drawStrokeOnSprite(this.fCurrentStroke)

	    // Reset the stroke.
	    //
	    this.fCurrentStroke.clear()

	    //this._selectedObject.grabImageFromCanvas(this.fCanvas)
	}
	this._strokeStarted = false
    }
    
    onDrop(e)
    {
	e.preventDefault()

	//const lines = e.dataTransfer.getData("text/uri-list").split("\n");


	console.log("these are the types of dropped: " + e.dataTransfer.types)

	var droppedText = e.dataTransfer.getData("text/plain")
	var droppedHTML = e.dataTransfer.getData("text/html");

	console.log("text: " + droppedText)
	console.log("html: " + droppedHTML)
	
	const fileList = e.dataTransfer.files;


	
	var rex = /src="?([^"\s]+)"?\s*/;
	var url, res;
	url = rex.exec(droppedHTML);


	console.log("url: " + url)

	if (url) {
	    let center = [e.offsetX, e.offsetY]
	    this._box2dWorld.addBoxWithTexture(center, this.getCurrentFrame(), url[1])
	} else {
	    console.log("no url")

	    let center = [e.offsetX, e.offsetY]

	    this._fTextBox._div.innerHTML = droppedHTML
	    
	    //this._fTextBox.showAt([e.offsetX, e.offsetY])
	    droppedText = droppedText.trim()
	    this._box2dWorld.addBoxWithText(center, 300, this.getCurrentFrame(), droppedText)

	    
	}

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

    boxToolsVisible()
    {
	let boxToolWnd = document.getElementById("boxToolsWnd")
	if (boxToolWnd.style.display == "none" || boxToolWnd.style.display == "") {
	    return false
	} else {
	    return true
	}
    }
    
    showBoxTools(b)
    {
	let boxToolWnd = document.getElementById("boxToolsWnd")
	boxToolWnd.style.display = "grid"
	
	// get the center of the box.
	//
	let bCenter = b.getCenterInPixels()

	//boxToolWnd.style.left = (bCenter.x - b._widthInPixels/2  + 'px')
	//boxToolWnd.style.top  = (bCenter.y + b._heightInPixels/2 + 'px')
	boxToolWnd.style.left = (bCenter.x + 'px')
	boxToolWnd.style.top  = (bCenter.y + 'px')
	console.log(bCenter.x, bCenter.y)
    }

    hideBoxTools()
    {
	let boxToolWnd = document.getElementById("boxToolsWnd")
	boxToolWnd.style.display = "none";
    }

    playAnim()
    {
	this._pauseAnim = false

	if (this._fToolbar_box.isVisible()) {
	    this._fToolbar_box.hide()
	}

	this._toolMode = this.kDrawObject;
    }
    
    pauseAnim()
    {
	this._pauseAnim = true
    }

    deleteSelectedBox()
    {
	this._box2dWorld.deleteBox(this._selectedObject)
	this._selectedObject = null
	if (this._fToolbar_box.isVisible()) {
	    this._fToolbar_box.hide()
	}	
    }

    splitSelectedBox()
    {
	console.log("about to split " + this._selectedObject._text)

	this._box2dWorld.split(this._selectedObject, this.getCurrentFrame())
	    
	this.deleteSelectedBox()


	// Have to do this so the box gets added to the simulation.
	// kind of a hack.
	//
	if (this._pauseAnim) {
	    this.setFrame(this._currentFrame)
	}
    }
    
    setToolMode(m)
    {
	this._toolMode = m
    }
}

export default Tcanvas;
