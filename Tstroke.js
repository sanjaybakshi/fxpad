

class Tstroke
{
    constructor() {

	this._pointList    = []
	this._pressureList = []

	this._color = ""
	
	this.push = function(pt, pressure) {
	    this._pointList.push(pt)
	    this._pressureList.push(pressure)
	}
    }

    clear()
    {
	this._pointList    = []
	this._pressureList = []
    }

    draw(ctx)
    {
	if (this._pointList.length == 0) {
	    return
	}
	
	//ctx.strokeStyle = 'black'
	ctx.strokeStyle = this._color
	ctx.lineCap     = 'round'
	ctx.lineJoin    = 'round'


	for (let i=0; i < this._pointList.length-1; i++) {

	    let pt1 = this._pointList[i]
	    let pt2 = this._pointList[i+1]

	    let pr  = this._pressureList[i] * 8


	    ctx.beginPath()
	    ctx.moveTo(pt1[0],pt1[1])
	    ctx.lineWidth = pr
	    ctx.lineTo(pt2[0],pt2[1])
	    ctx.stroke();
	    ctx.closePath()

	    //const output = document.getElementById("output")
	    //output.textContent = 'pe: ' + i + ' ' + pr
	    //console.log(i,pr)
	}
    }
    
    axisAlignedBox()
    //
    // Description:
    //     Constructs a box that bounds the points.
    //
    {
	if (this._pointList.length == 0) {
	    return null
	}
	
	let lo_x = this._pointList[0][0]
	let lo_y = this._pointList[0][1]
	let hi_x = this._pointList[0][0]
	let hi_y = this._pointList[0][1]
	
	for (const p of this._pointList) {

	    lo_x = Math.min(lo_x, p[0])
	    lo_y = Math.min(lo_y, p[1])
	    hi_x = Math.max(hi_x, p[0])
	    hi_y = Math.max(hi_y, p[1])
	}

	let width  = hi_x - lo_x;
	let height = hi_y - lo_y; 

	return {'center' : [lo_x + width / 2.0, lo_y + height / 2.0],
		'width'  : width,
		'height' : height}
    }
}    

export default Tstroke;
