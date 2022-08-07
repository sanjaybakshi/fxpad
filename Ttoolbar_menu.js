import Tdiv         from "./Tdiv.js";
import TdrawUtils   from "./TdrawUtils.js";
import Ttouch       from "./Ttouch.js";

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

    menuItemPressed(e)
    {
	console.log(e.target.id)
	if (e.target.id == "menuOptionLoadId") {


	    let input = document.createElement('input');
	    input.type = 'file';
	    input.onchange = _this => {
		let files =   Array.from(input.files);
		console.log(files);
		
		
		if (files.length > 0) {
		    console.log(files[0].name)


		    let reader = new FileReader();
 
		    reader.onload = (e) => {
			const fileInfo = e.target.result;

			console.log(fileInfo)

			let boxInfo = JSON.parse(fileInfo)

			let boxDict = boxInfo.boxes
			for (const b of boxDict) {
			    console.log(b)

			    let newBox = fModel.fBox2dWorld.addBox([110,110], b.width, b.height, b.start, b.isDynamic)
			    newBox.setActivateOnCollision(b.activateOnCollisions)

			}
		    };
 
		    reader.onerror = (e) => alert(e.target.error.name);
 
		    reader.readAsText(files[0]);
		}
	    };
	    input.click();


	    
	    console.log("load")
	} else if (e.target.id == "menuOptionSaveId") {

	    let content = "This is the content"
	    let mimeType = "text/plain"
	    let fileName = "Hello.txt"

	    let b2t = fModel.fBox2dWorld.boxes2dict()

	    let b2t_strings = JSON.stringify(b2t)
	    
	    var a = document.createElement('a')
	    var blob = new Blob([b2t_strings], {type: mimeType})
	    var url = URL.createObjectURL(blob)
	    a.setAttribute('href', url)
	    a.setAttribute('download', fileName)
	    a.click()


	    
	    
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
