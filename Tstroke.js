

class Tstroke
{
    constructor() {

	this._pointList = []

	this.push = function(p) {
	    this._pointList.push(p)
	}
    }

    clear()
    {
	this._pointList = []
    }

    draw(ctx)
    {
	if (this._pointList.length == 0) {
	    return
	}
	
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;

	ctx.moveTo(this._pointList[0][0], this._pointList[0][1])
	
	for (const p of this._pointList) {
	    ctx.lineTo(p[0], p[1]);
	}
	ctx.stroke();
	ctx.closePath();

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
