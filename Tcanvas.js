import Tstroke      from "./Tstroke.js";
//import Tbox2d_world from "./Tbox2d_classes.js";
import Timage       from "./Timage.js";
import Tevent       from "./Tevent.js";

import Ttouch	    from "./Ttouch.js";

import Ttoolbar_main  from "./Ttoolbar_main.js";
import Ttoolbar_menu  from "./Ttoolbar_menu.js";
import Ttoolbar_box   from "./Ttoolbar_box.js";
import TtextBox       from "./TtextBox.js";
//import TselectionList from "./TselectionList.js";


import { fModel } from './Tmodel.js'


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
	
	this._fToolbar_box     = new Ttoolbar_box("toolbar.boxId", this)
	this._fToolbar_main = new Ttoolbar_main("toolbar.mainId", this)	

	this._fToolbar_main.show()


	this._fToolbar_menu = new Ttoolbar_menu("toolbar.menuId", this)
	this._fToolbar_menu.show()
	
	this._fTextBox = new TtextBox("dragDropWindow")

	
	//this._selectionList  = new TselectionList(this)

	this._canvasWidth = function() {

	    return this.fCanvas.offsetWidth
	}

	this._canvasHeight = function() {
	    return this.fCanvas.offsetHeight
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

	console.log('setting up ptaste')	    

	document.onpaste = this.onPaste
	
	/*
	document.onpaste = function (event) {
	    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
	    console.log(JSON.stringify(items)); // might give you mime types
	    for (var index in items) {
		var item = items[index];
		if (item.kind === 'file') {
		    var blob = item.getAsFile();
		    var reader = new FileReader();
		    reader.onload = function (event) {
			console.log(event.target.result); // data url!
		    }; 
		    reader.readAsDataURL(blob);
		}
	    }
	};
    
	this.fCanvas.addEventListener('paste', (e) => {
	    this.onPaste(e)
	});
	*/
	// Test to draw an image.
	//
	//this._testSprite = new Timage([this._canvasWidth()/2, this._canvasHeight()/2]);
	//this._testSprite.setScaleWH(100,200)
	//this._testSprite.setScale(100)



    }

    init() {
	this.setFrameRange(30*5) // 30fps * 5 seconds = 150 frames
	
	window.requestAnimationFrame(this.draw);

	var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
	
	this.fContext.scale(scale, scale)
	
	//this._box2dWorld = new Tbox2d_world(this._canvasWidth(), this._canvasHeight())
	//Tmodel.fBox2dWorld = new Tbox2d_world(this._canvasWidth(), this._canvasHeight())	

	console.log("this is the width: " + this._canvasWidth())
	console.log("this is the scale: " + scale)
	fModel.init(this._canvasWidth(), this._canvasHeight(), this.selectionListChanged.bind(this))

	
	// Add bottom boundary.
	//
	let boundaryPixels = 10
	//fModel.fBox2dWorld.addBox( {x:this._canvasWidth()/2,y:this._canvasHeight()-boundaryPixels/2},
	//this._canvasWidth(), boundaryPixels, 0, false );

	//this.addBox( [fCanvasWidth/2,25], 50, 50, 0, false);	



	/*
	var ballBodyDef = {
	    linearDamping: 1.5,
	    angularDamping: 1
	};

	
	for (i = 0; i < 10; i++) {
	    var ball = world.createDynamicBody(ballBodyDef);
	    ball.setBullet(true);
	    ball.setPosition(balls[i]);
	    ball.createFixture(pl.Circle(BALL_R), ballFixDef);
	    ball.render = balls[i].render;
	}
*/
	

	this.setFrame(0)

	// For debugging draw
	//
	//this._debugImage = new Image()
	//this._debugImage.src = "./dutt_test.png"
    }

    draw = () => {

	if (!this._pauseAnim) {

	    //this._box2dWorld.step()
	    fModel.fBox2dWorld.step()
	    let frameNum = this.getCurrentFrame() + 1
	    this.setFrame(frameNum)
	}
	
	//this.fContext.setTransform(1, 0, 0, 1, 0, 0);
	
	this.fContext.clearRect(0, 0, this._canvasWidth(), this._canvasHeight())
	

	//this._box2dWorld.draw(this.fContext, this._pauseAnim)
	fModel.fBox2dWorld.draw(this.fContext, this._pauseAnim)	

	if (this._pauseAnim) {

	    // Draw the selected objects.
	    //
	    for (const b of fModel.fSelectionList._sList) {
		b.draw(this.fContext, true, true)
	    }

	    this._fToolbar_main.draw(this.fContext)
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
/*
	this.fContext.save()
	this.fContext.font = '18px ' + 'Avenir'
	this.fContext.textBaseline = 'top';
	this.fContext.fillText('ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz Sanjay Dutt', 100,100)

	this.fContext.drawImage(this._debugImage, 100,200,this._debugImage.width/2, this._debugImage.height/2)

	this.fContext.restore()
*/

	
	window.requestAnimationFrame(this.draw);

    }

    mouseDown(e)
    {
	this._fToolbar_main.mouseDown(e)	
    }

    mouseUp(e)
    {
	this._fToolbar_main.mouseUp(e)		
    }

    mouseMove(e)
    {
	this._fToolbar_main.mouseMove(e)
    }

    testFunc2()
    {
	console.log("testFunc2")
    }
    testFunc(data)
    {
	return function(event)
	{
	    console.log(data)
	}
    }

    onPaste(e)
    {
	e.preventDefault()



	
	function onLoad_file(callbackFunc, params)
	{
	    return function(event) {
		var image = new Image()
		image.src = event.target.result

		
		function onLoad_image(callbackFunc, params)
		{
		    console.log(image.width, image.height)

		    //let newBoxArray = []

		    params.image = image
		    callbackFunc(params)
		    //let newBox = this._box2dWorld.addBoxWithImage([p.x,p.y], this.getCurrentFrame, image)
		    let newBox = fModel.fBox2dWorld.addBoxWithImage({x:p.x,y:p.y}, this.getCurrentFrame, image)

		    
		    //newBoxArray.push(newBox)

		    //this._selectionList.replace(newBoxArray)
		}

		image.onload = onLoad_image(callbackFunc, params)
	    }	    
	}
	
	var items = (e.clipboardData || e.originalEvent.clipboardData).items;
	for (var index in items) {
	    var item = items[index];
	    if (item.kind === 'file') {
		var blob = item.getAsFile();
		var reader = new FileReader();


		let params = { 'pos': [100,200] }
		
		reader.onload = function(event) {
		    let params = { 'pos': {x:100,y:200} }
		    var image = new Image()
		    image.src = event.target.result

		    image.onload = () =>  {
			console.log(image.width, image.height)

			params.image = image
			console.log(params)

			let newBoxArray = []
			//let newBox = this._box2dWorld.addBox(params)
			let newBox = fModel.fBox2dWorld.addBox2(params)
			newBoxArray.push(newBox)
			fModel.fSelectionList.replace(newBoxArray)
		    

		    }
		}


		/*
		reader.onload = (function(callbackFunc) {
		    return function(event) {
			console.log("why")
			console.log(callbackFunc)
		    }
		})("sanjay")
		*/

		/*
		reader.onload = function(event) {
		    console.log("why")

		    let params = { 'pos': [100,200] }
		    var image = new Image()
		    image.src = event.target.result
		    image.onload = () => {
			console.log(image.width, image.height)
			console.log(params)

			params.image = image
			let newBox = this._box2dWorld.addBox(params)
			newBoxArray.push(newBox)

		    //this._selectionList.replace(newBoxArray)
			
			//let center = [e.offsetX, e.offsetY]
			//let newBox = this._box2dWorld.addBoxWithTexture(center, this.getCurrentFrame(), url[1])
			//console.log(center)
			
			
		    }
		    
		    
		}
*/
/*
		reader.onload = function(event) {
		    console.log("called it")
		}
		*/
		/*
		reader.onload = function (event) {
		    //console.log(event.target.result)

		    var image = new Image()
		    image.src = event.target.result
		    image.onload = () => {
			console.log(image.width, image.height)
			let center = [e.offsetX, e.offsetY]
			//let newBox = this._box2dWorld.addBoxWithTexture(center, this.getCurrentFrame(), url[1])
			console.log(center)
			
			
		    }
		    //let img = event["target"]
		    //console.log(img.width,img.height)
		    console.log(event.target.result); // data url!
		}; 
		*/
		reader.readAsDataURL(blob);
	    }
	}
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

	let newBoxArray = []
	
	if (url) {
	    let center = [e.offsetX, e.offsetY]
	    //let newBox = fModel.fBox2dWorld.addBoxWithTexture(center, this.getCurrentFrame(), url[1])

	    let params = { 'pos': {x:e.offsetX, y:e.offsetY} }
	    
	    var image = new Image()
	    image.src = url[1]
	    
	    image.onload = () => {

		params.image = image
		
		let newBoxArray = []
		let newBox = fModel.fBox2dWorld.addBox2(params)
		newBoxArray.push(newBox)
		fModel.fSelectionList.replace(newBoxArray)
	    }

	    
	    //newBoxArray.push(newBox)
	} else {
	    console.log("no url")

	    let center = {x:e.offsetX, y:e.offsetY}

	    this._fTextBox._div.innerHTML = droppedHTML
	    
	    //this._fTextBox.showAt([e.offsetX, e.offsetY])
	    droppedText = droppedText.trim()
	    //let newBox = this._box2dWorld.addBoxWithText(center, 300, this.getCurrentFrame(), droppedText)
	    let newBox = fModel.fBox2dWorld.addBoxWithText(center, 300, this.getCurrentFrame(), droppedText)	    
	    newBoxArray.push(newBox)	    
	}

	// Have to do this so the box gets added to the simulation.
	// kind of a hack.
	//
	if (this._pauseAnim) {
	    this.setFrame(this._currentFrame)

	    // Need to call this here (not right after creating it because it won't be fully
	    // construcuted until setFrame is called.
	    //
	    fModel.fSelectionList.replace(newBoxArray)	    
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
	    //this._box2dWorld.reset()
	    //this.fModel.fBox2dWorld.reset()
	    fModel.fBox2dWorld.reset()	    
            this._currentFrame = 0
        } else if (this._currentFrame <= 0) {
	    //this._box2dWorld.reset()
	    fModel.fBox2dWorld.reset()
            this._currentFrame = 0
        }

        // Add the bodies.
        //
	//this._box2dWorld.setFrame(this._currentFrame)
	fModel.fBox2dWorld.setFrame(this._currentFrame)

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
	if (this._fToolbar_main.isVisible()) {
	    this._fToolbar_main.hide()
	}
	if (this._fToolbar_menu.isVisible()) {
	    this._fToolbar_menu.hide()
	}
    }
    
    pauseAnim()
    {
	this._pauseAnim = true

	if (this.shouldShowToolbar_box()) {
	
	    this._fToolbar_box.show()
	}
	
	this._fToolbar_main.show()
	this._fToolbar_menu.show()
    }

    selectionListChanged()
    {
	// Show the toolbar for these objects.
	//
	if (fModel.fSelectionList._sList.length > 0) {
	    b = fModel.fSelectionList._sList[0]
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

	    if (this.shouldShowToolbar_box()) {
		this._fToolbar_box.showAt([xP,yP])
	    } else {
		this._fToolbar_box.hide()		
	    }
	} else {
	    this._fToolbar_box.hide()
	}

    }


    shouldShowToolbar_box()
    {
	// Only show it if in selection tool.
	//
	return this._fToolbar_main.inSelectionTool()
    }
}

export default Tcanvas;
