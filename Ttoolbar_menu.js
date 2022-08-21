import Tdiv         from "./Tdiv.js";
import TdrawUtils   from "./TdrawUtils.js";
import Ttouch       from "./Ttouch.js";
import Timage       from "./Timage.js";
import TfileUtils   from "./TfileUtils.js";

import { fModel } from './Tmodel.js'

class Ttoolbar_menu extends Tdiv
{
    constructor(toolbar_menuId, canvas)
    {
	super(toolbar_menuId)

	//this._selectCtrl     = document.getElementById("selectId")	

	this._menuButtonCtrl = document.getElementById("menuId")

	
	this._menuOptionsCtrl = new Tdiv("menuOptionsId")
	
	this._fCanvas = canvas

	this.hide()


	this._menuButtonCtrl.addEventListener('click', (e) => {
	    this.menuPressed(e)
	});
	this._menuButtonCtrl.addEventListener('mousedown', (e) => {
	    e.stopPropagation()
	});
	this._menuButtonCtrl.addEventListener('mouseup', (e) => {
	    e.stopPropagation()
	});

	document.addEventListener('click', (e) => {

	    // Remove the popup menu if user clicks anywhere else (if it's visible)
	    //	    
	    if (e.target.id != "menuId" && this._menuOptionsCtrl.isVisible()) {
		this._menuOptionsCtrl.hide()
	    }
	});


	this._loadMenuItemCtrl   = document.getElementById("menuOptionLoadId")
	this._saveMenuItemCtrl   = document.getElementById("menuOptionSaveId")
	this._exportMenuItemCtrl = document.getElementById("menuOptionExportId")	

	
	this._loadMenuItemCtrl.addEventListener('click', (e) => {
	    this.menuItemPressed(e)
	});
	this._loadMenuItemCtrl.addEventListener('mousedown', (e) => {
	    e.stopPropagation()
	});
	this._loadMenuItemCtrl.addEventListener('mouseup', (e) => {
	    e.stopPropagation()
	});


	this._saveMenuItemCtrl.addEventListener('click', (e) => {
	    this.menuItemPressed(e)
	});
	this._saveMenuItemCtrl.addEventListener('mousedown', (e) => {
	    e.stopPropagation()
	});
	this._saveMenuItemCtrl.addEventListener('mouseup', (e) => {
	    e.stopPropagation()
	});


	this._exportMenuItemCtrl.addEventListener('click', (e) => {
	    this.menuItemPressed(e)
	});
	this._exportMenuItemCtrl.addEventListener('mousedown', (e) => {
	    e.stopPropagation()
	});
	this._exportMenuItemCtrl.addEventListener('mouseup', (e) => {
	    e.stopPropagation()
	});
	

	//this._menuButtonCtrl.style.height = 24 + 'px'
	//this._menuButtonCtrl.style.width  = 24	+ 'px'
	
    }

    async loadZip(zipFileHandles)
    {
	//console.log(zipFileHandles)

	if (zipFileHandles.length <= 0)
	    return

	let zipContents = await TfileUtils.getAllFilesFromZip(zipFileHandles[0])

	let spriteDict = {}

	let fileNames = zipContents.fileNames
	let fileHandles = zipContents.fileHandles
	
	//console.log(fileNames, fileHandles)
	//console.log(fileNames.length, fileHandles.length)


	
	zipContents.fileNames.forEach((fName, index) => {
	    //console.log(fName)
	    if (fName.endsWith('.png')) {

		// load the image.
		//
		spriteDict[fName] = zipContents.fileHandles[index]
		//console.log(fName, zipContents.fileHandles[index])
	    }
	});
	
	//console.log(zipContents.fileNames)
	//console.log(spriteDict)
    }
    
    async menuItemPressed(e)
    {
	//console.log(e.target.id)
	if (e.target.id == "menuOptionLoadId") {

	    //TfileUtils.getFileFromBrowser(this.loadZip)

	    //let filePicked = TfileUtils.filePicker()



	    // Let the user pick the zip file.
	    //
	    let files = await TfileUtils.filePicker()

	    if (files.length < 0) {
		return
	    }
	    //console.log(files)

	    // Find the images in the zip file.
	    //
	    let allImages = await TfileUtils.getFilesFromZip(files[0], ".png")

	    // Build a map to easily find the image file handle based on name.
	    //
	    let imgMap = {}
	    let index = 0
	    for (const img of allImages.fileNames) {

		let fHandle = allImages.fileHandles[index]
		let justFileName = img.substring(img.lastIndexOf('/')+1)
		imgMap[justFileName] = fHandle
		index = index+1
	    }
	    //console.log(allImages)
	    //console.log(allImages.fileHandles.length, allImages.fileNames.length)

	    
	    // Find the json in the zip file.
	    //
	    let jsonFiles = await TfileUtils.getFilesFromZip(files[0], ".json")
	    //console.log(jsonFiles)

	    //console.log(jsonFiles.fileHandles.length, jsonFiles.fileNames.length)

	    if (jsonFiles.fileHandles.length < 0) {
		return
	    }
	    
	    // Read the json file into memory.
	    let jsonInfo = await TfileUtils.readFileFromZip_string(jsonFiles.fileHandles[0])
	    let boxInfo = JSON.parse(jsonInfo)

	    let boxDict = boxInfo.boxes
	    for (const b of boxDict) {
		let params = { 'pos': b.pos }
		//console.log(b)

		
		if (b.hasOwnProperty('spriteImage')) {
		    // Load the image.
		    //
		    //console.log(b.spriteImage)

		    if (imgMap.hasOwnProperty(b.spriteImage)) {
			let imgHandle = imgMap[b.spriteImage]
			
			let imgBlob = await TfileUtils.readFileFromZip_binary(imgHandle)

			params.image = await TfileUtils.getImageFromBlob(imgBlob)
			let newBox = fModel.fBox2dWorld.addBox2(params)
			console.log('add a box')
			
			/*
			
			var image = new Image()
			//image.src = imgInfo
			image.src = URL.createObjectURL(imgInfo)

			image.onload = () => {

			    params.image = image
		
		    }
			*/

			//let newBox = fModel.fBox2dWorld.addBox2(params)
			
		    }
		} else {

		    let newBox = fModel.fBox2dWorld.addBox(b.pos, b.width, b.height, b.start, b.isDynamic)
		    newBox.setActivateOnCollision(b.activateOnCollisions)


		}
	    }

	    return
	    

	    let input = document.createElement('input');
	    input.type = 'file';
	    input.onchange = _this => {

		console.log(input.files[0])
		let files =   Array.from(input.files);
		
		if (files.length > 0) {
		    console.log(files[0].name)


		    


		    

		    let reader = new FileReader();
 
		    reader.onload = (e) => {
			const fileInfo = e.target.result;
			
			JSZip.loadAsync(fileInfo).then(function(content) {
			    
			    for(let [filename, file] of Object.entries(content.files)) {


				if (filename.endsWith('.json')) {

				    file.async('string').then((jsonFile) => {
					let boxInfo = JSON.parse(jsonFile)

					let boxDict = boxInfo.boxes
					for (const b of boxDict) {
					    let params = { 'pos': b.pos }
					    
					    console.log(b)
					    if (b.hasOwnProperty('spriteImage')) {
						
						let newBox = fModel.fBox2dWorld.addBox2(params)
						
						
						console.log("has an image")
					    

					    /*
					    if (b.hasOwnProperty('spriteImage')) {
						var image = new Image()
						image.src = b.spriteImage
					    
						
						image.onload = () => {
						
						    params.image = image
						
						
						    let newBox = fModel.fBox2dWorld.addBox2(params)
						}
					    }
					    */
					    } else {

						let newBox = fModel.fBox2dWorld.addBox(b.pos, b.width, b.height, b.start, b.isDynamic)
						newBox.setActivateOnCollision(b.activateOnCollisions)

					    }
					
					}
				    })
				    
				    
				    console.log(filename);
				}
			    }
			});
/*
			
			//console.log(fileInfo)

			let boxInfo = JSON.parse(fileInfo)

			let boxDict = boxInfo.boxes
			for (const b of boxDict) {
			    //console.log(b)

			    let params = { 'pos': b.pos }
			    
			    if (b.hasOwnProperty('spriteImage')) {
				var image = new Image()
				image.src = b.spriteImage

				
				image.onload = () => {

				    params.image = image

				    
				    let newBox = fModel.fBox2dWorld.addBox2(params)
				}


			    } else {
				let newBox = fModel.fBox2dWorld.addBox(b.pos, b.width, b.height, b.start, b.isDynamic)
				newBox.setActivateOnCollision(b.activateOnCollisions)
			    }
			}
*/
		    };
 
		    reader.onerror = (e) => alert(e.target.error.name);
		    reader.readAsArrayBuffer(files[0]);
		    
		    //reader.readAsText(files[0]);
		}
	    };
	    input.click();


	    
	    console.log("load")
	} else if (e.target.id == "menuOptionSaveId") {


	    let b2d = fModel.fBox2dWorld.boxes2dict()
	    

	    const zip = new JSZip();

	    let boxFolder = zip.folder("fxpad_z")
	    
	    //zip.file("Hello.txt", "Hello World\n");

	    //const img = zip.folder("images");
	    //img.file("smile.gif", imgData, {base64: true});

	    // Iterate over the boxes and output their images.
	    //
	    let counter = 0
	    let boxImages = []
	    
	    for (const b of b2d.boxes) {
		if (b.hasOwnProperty('spriteImage')) {
		    let img = b.spriteImage

		    console.log(img)
		    let imgData = Timage.getBase64Image(img)
		    
		    let imgName = ("BoxImage_" + counter + ".png")
		    
		    boxFolder.file(imgName, imgData, {base64: true});
		    boxImages.push(imgName)
		    counter = counter + 1
		}
	    }

	    // Iterate over the boxes and switch their images to point at the files just generated.
	    //
	    counter = 0
	    for (const b of b2d.boxes) {
		if (b.hasOwnProperty('spriteImage')) {
		    b.spriteImage = boxImages[counter]
		    counter = counter+1

		}
	    }

	    // Generate the json file.
	    //
	    let b2t_strings = JSON.stringify(b2d)
	    boxFolder.file("boxes.json", b2t_strings)
	    

		
	    zip.generateAsync({type:"blob"}).then(function(content) {
		// see FileSaver.js
		saveAs(content, "box.zip");
	    });





	    console.log("trying to generate a zip")
	    return
	    
	    
	    /*
	    let content = "This is the content"
	    let mimeType = "text/plain"
	    let fileName = "Hello.txt"


	    
	    for (const b of b2d.boxes) {
		if (b.hasOwnProperty('spriteImage')) {

		    let img = b.spriteImage
		    
		    // Save the sprite to a separate file.
		    //
		    let inMemoryCanvas = new OffscreenCanvas(img.width, img.height)
		    let inMemoryContext = inMemoryCanvas.getContext("2d");

		    inMemoryContext.drawImage(img,0,0)

		    inMemoryCanvas.convertToBlob().then(function(blob) {
			console.log(blob)

			const link = document.createElement('a');
			link.download = 'download.png';
			link.href = URL.createObjectURL(blob)

			//link.href = inMemoryCanvas.toDataURL();
			link.click();
			link.delete;
		    })
		}
	    }
	    
	    let b2t_strings = JSON.stringify(b2d)
	    
	    var a = document.createElement('a')
	    var blob = new Blob([b2t_strings], {type: mimeType})
	    var url = URL.createObjectURL(blob)
	    a.setAttribute('href', url)
	    a.setAttribute('download', fileName)
	    a.click()
*/

	    
	    
	    console.log("save")
	} else if (e.target.id == "menuOptionExportId") {
	    console.log("export")

	}
    }
    
    menuPressed(e)
    {
	console.log("menu pressed")
	
	if (e.target.id == "menuId") {

	    this._menuOptionsCtrl.toggleDisplay()

	    if (this._menuOptionsCtrl.isVisible()) {
		// position it relative to the button.
		//
		let btnPos = this.getPosition()

		let menuSize = this._menuOptionsCtrl.getWidthHeight()

		let xPos = btnPos[0] - menuSize[0]
		let yPos = btnPos[1] + 40
	    
		this._menuOptionsCtrl.showAt([xPos,yPos])
	    }
	}
    }
    
    hide()
    {
	super.hide()    
    }

    show()
    {
	super.show()
	
	// compute coordinates to show.
	//

	//let r = this._fCanvas.fCanvas.getBoundingClientRect()
	//let r = window.getBoundingClientRect()
	//console.log(r)
	
	//console.log(this._fCanvas._canvasWidth, this._fCanvas._canvasHeight)

	//let x = window.innerWidth - this._div.style.width

	let x = window.innerWidth - 40
	this._div.style.left = x + 'px'
	this._div.style.top  = 0 + 'px'
    }
    

}

export default Ttoolbar_menu
