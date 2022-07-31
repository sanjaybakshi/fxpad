class TdrawUtils
{
    constructor() {

    }

    static drawTriangle(ctx, center, w, h, direction, fillColor='black', strokeStyle=null, strokeWidth=0)

    //
    // Description:
    //		Draw a triangle.
    //	Arguments:
    //		direction: "east"  - point is on the right  like '>'
    //		direction: "west"  - point is on the left   like '<'
    //		direction: "north" - point is on the top    like '^'
    //		direction: "south" - point is on the bottom like 'v'
    //
    {
	
	ctx.beginPath();

	if (direction == 'east') {
	    ctx.moveTo(center.x + w, center.y)
	    ctx.lineTo(center.x - w, center.y + h)
	    ctx.lineTo(center.x - w, center.y - h)
	    ctx.lineTo(center.x + w, center.y)		
	} else if (direction == 'south') {
	    ctx.moveTo(center.x, center.y + h)
	    ctx.lineTo(center.x - w, center.y - h)
	    ctx.lineTo(center.x + w, center.y - h)
	    ctx.lineTo(center.x, center.y + h)		
	}
	
	if (fillColor) {
	    ctx.fillStyle = fillColor
	    ctx.fill();
	}
	if (strokeStyle) {
	    ctx.lineWidth = strokeWidth;
	    ctx.strokeStyle = strokeStyle;
	    ctx.stroke();	    
	}


    }
    
    static drawCircle(ctx, center, radius, fillColor='black', strokeStyle=null, strokeWidth=0)
    {
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);

	if (fillColor) {
	    ctx.fillStyle = fillColor
	    ctx.fill();
	}
	if (strokeStyle) {
	    ctx.lineWidth = strokeWidth;
	    ctx.strokeStyle = strokeStyle;
	    ctx.stroke();	    
	}
    }

    static isInsideCircle(p, center, radius)
    {
	console.log(p,center,radius)
	let d = Math.sqrt( (center.x - p.x)*(center.x - p.x) + (center.y - p.y)*(center.y - p.y) )
	if (d < radius) {
	    return true
	}
	return false
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

    static doRectsOverlap(r1, r2)
    {
	return !(r2.left > r1.right || 
		 r2.right < r1.left || 
		 r2.top > r1.bottom ||
		 r2.bottom < r1.top);

    }

    // Check if rectangle a contains rectangle b
    // Each object (a and b) should have 2 properties to represent the
    // top-left corner (x1, y1) and 2 for the bottom-right corner (x2, y2).
    static contains(a, b) {
	return !(
	    b.x1 < a.x1 ||
		b.y1 < a.y1 ||
		b.x2 > a.x2 ||
		b.y2 > a.y2
	);
    }
    
    // Check if rectangle a overlaps rectangle b
    // Each object (a and b) should have 2 properties to represent the
    // top-left corner (x1, y1) and 2 for the bottom-right corner (x2, y2).
    static overlaps(a, b) {

	//console.log("testing: ")
	//console.log("a: " + a.x1 + " " + a.y1 + " " + a.x2 + " " + a.y2)
	//console.log("b: " + b.x1 + " " + b.y1 + " " + b.x2 + " " + b.y2)	



	// no horizontal overlap
	if (a.x1 >= b.x2 || b.x1 >= a.x2) return false;
	
	// no vertical overlap
	if (a.y1 >= b.y2 || b.y1 >= a.y2) return false;
	
	return true;
    }
    
    // Check if rectangle a touches rectangle b
    // Each object (a and b) should have 2 properties to represent the
    // top-left corner (x1, y1) and 2 for the bottom-right corner (x2, y2).
    static touches(a, b) {
	// has horizontal gap
	if (a.x1 > b.x2 || b.x1 > a.x2) return false;
	
	// has vertical gap
	if (a.y1 > b.y2 || b.y1 > a.y2) return false;
	
	return true;
    }


}

export default TdrawUtils

