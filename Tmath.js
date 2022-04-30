class Tmath
{
    constructor() {

    }

    static remap(low1, high1, low2, high2, value)
    //
    // Description:
    //      Takes a value between (low1,high1) and remaps it to be between (low2,high2)
    //
    {
	return low2 + (value - low1) * (high2 - low2) / (high1 - low1)
    }


    static xformMatrix(angle, t)
    {
	let cAngle = Math.cos(angle)
	let sAngle = Math.sin(angle)

	return [ [cAngle, sAngle, 0.0], [-sAngle, cAngle, 0], [t[0], t[1], 1.0] ];
    }

    static xformPoint(p, mat)
    {
	// See: https://developer.apple.com/documentation/coregraphics/cgaffinetransform
	let a  = mat[0][0]
	let b  = mat[0][1]
	let c  = mat[1][0]
	let d  = mat[1][1]
	let tx = mat[2][0]
	let ty = mat[2][1]
	
	let newP = [a*p[0] + c*p[1] + tx,
		    b*p[0] + d*p[1] + ty]

	return newP
    }
}

export default Tmath
