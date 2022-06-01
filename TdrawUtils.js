class TdrawUtils
{
    constructor() {

    }

    static drawRect(ctx, center, width, height)
    {
	let p0 = [center.x - width/2, center.y - height/2]
	let p1 = [center.x - width/2, center.y + height/2]
	let p2 = [center.x + width/2, center.y + height/2]
	let p3 = [center.x + width/2, center.y - height/2]	
	
	ctx.beginPath();
	ctx.moveTo(p0[0], p0[1]);
	ctx.lineTo(p1[0], p1[1]);
	ctx.lineTo(p2[0], p2[1]);
	ctx.lineTo(p3[0], p3[1]);
	ctx.lineTo(p0[0], p0[1]);    
	ctx.stroke();	
    }

    static fillRect(ctx, center, width, height, fillColor = "black")
    {
	ctx.fillStyle = fillColor
	ctx.fillRect(center.x-width/2, center.y-height/2, width, height)
    }

    static isInsideRect(p, center, width, height)
    {
	if (p.x >= center.x-width/2 && p.x <= center.x+width/2 &&
	    p.y >= center.y-height/2 && p.y <= center.y + height/2) {
	    return true
	}
	return false
    }
}

export default TdrawUtils

