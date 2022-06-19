import Tdiv         from "./Tdiv.js";
import TdrawUtils   from "./TdrawUtils.js";
import Ttouch       from "./Ttouch.js";

import Ttool_makeBox   from "./Ttool_makeBox.js";
import Ttool_makeJoint from "./Ttool_makeJoint.js";
import Ttool_select    from "./Ttool_select.js";
import Ttool_xform     from "./Ttool_xform.js";
import Ttool_paint     from "./Ttool_paint.js";

class Ttoolbar_objects extends Tdiv
{
    constructor(toolbar_objectsId, canvas)
    {
	super(toolbar_objectsId)

	this._selectCtrl     = document.getElementById("selectId")	
	this._makeBoxCtrl    = document.getElementById("drawBoxId")
	this._drawCircleCtrl = document.getElementById("drawCircleId")
	this._drawJointCtrl  = document.getElementById("drawJointId")
	this._xformCtrl      = document.getElementById("xformId")
	this._paintCtrl      = document.getElementById("paintId")

	this._makeBoxTool = new Ttool_makeBox(canvas)	
	this._jointTool   = new Ttool_makeJoint(canvas)
	this._selectTool  = new Ttool_select(canvas)
	this._xformTool   = new Ttool_xform(canvas)
	this._paintTool   = new Ttool_paint(canvas)	

	this._currentTool = this._makeBoxTool
	
	this.fCanvas = canvas

	this._posA          = null
	this._posB          = null

	this._selectedObjs  = null
	
	this.hide()	

	this._selectCtrl.addEventListener('click', (e) => {
	    this.toolChange(e)
	});
	this._selectCtrl.addEventListener('mousedown', (e) => {
	    e.stopPropagation()
	});
	this._selectCtrl.addEventListener('mouseup', (e) => {
	    e.stopPropagation()
	});

	
	this._makeBoxCtrl.addEventListener('click', (e) => {
	    this.toolChange(e)
	});
	this._makeBoxCtrl.addEventListener('mousedown', (e) => {
	    e.stopPropagation()
	});
	this._makeBoxCtrl.addEventListener('mouseup', (e) => {
	    e.stopPropagation()
	});

	
	this._drawCircleCtrl.addEventListener('click', (e) => {
	    this.toolChange(e)
	});
	this._drawCircleCtrl.addEventListener('mousedown', (e) => {
	    e.stopPropagation()
	});
	this._drawCircleCtrl.addEventListener('mouseup', (e) => {
	    e.stopPropagation()
	});
	
	this._drawJointCtrl.addEventListener('click', (e) => {
	    this.toolChange(e)
	});
	this._drawJointCtrl.addEventListener('mousedown', (e) => {
	    e.stopPropagation()
	});
	this._drawJointCtrl.addEventListener('mouseup', (e) => {
	    e.stopPropagation()
	});
	
	this._xformCtrl.addEventListener('click', (e) => {
	    this.toolChange(e)
	});
	this._xformCtrl.addEventListener('mousedown', (e) => {
	    e.stopPropagation()
	});
	this._xformCtrl.addEventListener('mouseup', (e) => {
	    e.stopPropagation()
	});

	this._paintCtrl.addEventListener('click', (e) => {
	    this.toolChange(e)
	});
	this._paintCtrl.addEventListener('mousedown', (e) => {
	    e.stopPropagation()
	});
	this._paintCtrl.addEventListener('mouseup', (e) => {
	    e.stopPropagation()
	});

	
	this._toolMode = this.kDrawBox;
	this._makeBoxCtrl.style.backgroundColor    = "darkgray";
    }

    toolChange(e)
    {
	console.log("toolChange")
	this._currentTool.dismiss()
	
	if (e.target.id == "selectId") {
	    this._selectCtrl.style.backgroundColor     = "darkgray";	    
	    this._makeBoxCtrl.style.backgroundColor    = "gainsboro";
	    this._drawCircleCtrl.style.backgroundColor = "gainsboro";
	    this._drawJointCtrl.style.backgroundColor  = "gainsboro";
	    this._xformCtrl.style.backgroundColor      = "gainsboro";
	    this._paintCtrl.style.backgroundColor      = "gainsboro";
	    
	    this._toolMode = this.kSelect
	    this._currentTool = this._selectTool
	    
	} else if (e.target.id == "drawBoxId") {
	    this._selectCtrl.style.backgroundColor     = "gainsboro";	    	    	    
	    this._makeBoxCtrl.style.backgroundColor    = "darkgray";
	    this._drawCircleCtrl.style.backgroundColor = "gainsboro";
	    this._drawJointCtrl.style.backgroundColor  = "gainsboro";
	    this._xformCtrl.style.backgroundColor      = "gainsboro";
	    this._paintCtrl.style.backgroundColor      = "gainsboro";

	    console.log("switched to makeBox")
	    this._toolMode = this.kMakeBox
	    this._currentTool = this._makeBoxTool

	} else if (e.target.id == "drawCircleId") {
	    this._selectCtrl.style.backgroundColor     = "gainsboro";	    	    	    
	    this._makeBoxCtrl.style.backgroundColor    = "gainsboro";
	    this._drawCircleCtrl.style.backgroundColor = "darkgray";
	    this._drawJointCtrl.style.backgroundColor  = "gainsboro";
	    this._xformCtrl.style.backgroundColor      = "gainsboro";
	    this._paintCtrl.style.backgroundColor      = "gainsboro";
	    
	    this._toolMode = this.kDrawCircle

	} else if (e.target.id == "drawJointId") {
	    this._selectCtrl.style.backgroundColor     = "gainsboro";	    	    
	    this._makeBoxCtrl.style.backgroundColor    = "gainsboro";
	    this._drawCircleCtrl.style.backgroundColor = "gainsboro";
	    this._drawJointCtrl.style.backgroundColor  = "darkgray";
	    this._xformCtrl.style.backgroundColor      = "gainsboro";
	    this._paintCtrl.style.backgroundColor      = "gainsboro";	    
	    
	    this._toolMode = this.kDrawJoint	    

	    this._currentTool = this._jointTool
	} else if (e.target.id == "xformId") {
	    this._selectCtrl.style.backgroundColor     = "gainsboro";	    	    
	    this._makeBoxCtrl.style.backgroundColor    = "gainsboro";
	    this._drawCircleCtrl.style.backgroundColor = "gainsboro";
	    this._drawJointCtrl.style.backgroundColor  = "gainsboro";
	    this._xformCtrl.style.backgroundColor      = "darkgray";
	    this._paintCtrl.style.backgroundColor      = "gainsboro";
	    
	    this._toolMode = this.kXform

	    this._currentTool = this._xformTool
	} else if (e.target.id == "paintId") {
	    this._selectCtrl.style.backgroundColor     = "gainsboro";	    	    
	    this._makeBoxCtrl.style.backgroundColor    = "gainsboro";
	    this._drawCircleCtrl.style.backgroundColor = "gainsboro";
	    this._drawJointCtrl.style.backgroundColor  = "gainsboro";
	    this._xformCtrl.style.backgroundColor      = "gainsboro";
	    this._paintCtrl.style.backgroundColor      = "darkgray";
	    
	    this._toolMode = this.kPaint

	    this._currentTool = this._paintTool
	}

	this._currentTool.engage()
	
	e.stopPropagation()
    }
    
    hide()
    {
	super.hide()
    }


    draw(ctx)
    {
	this._currentTool.draw(ctx)
    }


    mouseDown(e)
    {
	this._currentTool.mouseDown(e)
    }
    mouseMove(e)
    {
	this._currentTool.mouseMove(e)	
    }
    
    mouseUp(e)
    {
	this._currentTool.mouseUp(e)		
    }

}


export default Ttoolbar_objects
