

class Tstroke
{
    constructor() {

	this._pointList    = []
	this._pressureList = []

	this._color = "black"

	this._brushWidth = 1

	/*
	this.push = function(pt, pressure) {
	    this._pointList.push(pt)
	    this._pressureList.push(pressure)
	}
	*/
    }


    
    clone() {
	let n = new Tstroke()

	for (let i=0; i < this._pointList.length; i++) {

	    let v = {x: this._pointList[i].x,
		     y: this._pointList[i].y}
	    
	    n._pointList.push(v)

	    let p = this._pressureList[i]
	    n._pressureList.push(p)
	}

	n._color = this._color
	n._brushWidth = this._brushWidth

	return n
    }


    push()
    {
	console.log("SHIT DONT CALL THIS")	
    }
    
    pushStrokePt(pt, pressure) {
	this._pointList.push(pt)
	this._pressureList.push(pressure)
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

	    let pr  = this._pressureList[i] * 1 * this._brushWidth


	    ctx.beginPath()
	    ctx.moveTo(pt1.x,pt1.y)
	    ctx.lineWidth = pr
	    ctx.lineTo(pt2.x,pt2.y)
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
	
	let lo_x = this._pointList[0].x
	let lo_y = this._pointList[0].y
	let hi_x = this._pointList[0].x
	let hi_y = this._pointList[0].y
	
	for (const p of this._pointList) {

	    lo_x = Math.min(lo_x, p.x)
	    lo_y = Math.min(lo_y, p.y)
	    hi_x = Math.max(hi_x, p.x)
	    hi_y = Math.max(hi_y, p.y)
	}

	let width  = hi_x - lo_x;
	let height = hi_y - lo_y; 

	return {'center' : [lo_x + width / 2.0, lo_y + height / 2.0],
		'width'  : width,
		'height' : height}
    }

    translate(vx, vy)
    {
	for (let i=0; i < this._pointList.length; i++) {
	    this._pointList[i].x = this._pointList[i].x - vx
	    this._pointList[i].y = this._pointList[i].y - vy
	}
	
    }
}    

export default Tstroke;
