class Tfont
{
    constructor() {

    }


    static wrapTextInBox(text, font, fontSize, maxWidth)
    //
    // Description:
    //		Will wrap the words in text using maxWidth
    //		and report back the width and height of the
    //		box.
    //
    {
	let inMemoryCanvas  = document.createElement("canvas")
	let inMemoryContext = inMemoryCanvas.getContext("2d");

	inMemoryContext.font = fontSize + 'px ' + font
	inMemoryContext.textBaseline = 'top';
	
	let maxWordHeight = fontSize + fontSize * 0.3

	let words = text.split(' ')
	
	let wordRects = []
	
	// fit the words into boxes.
	//
	let xPos = 0
	let yPos = 0

	let space = "i"
	let metrics    = inMemoryContext.measureText(space);
	//let spaceWidth  = (Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight))
	//let spaceHeight = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);

	let spaceWidth  = Math.abs(metrics.width)
	let spaceHeight = fontSize
	
	let actualWidth  = 0
	let actualHeight = 0

	//console.log("ffff: " + parseInt(inMemoryContext.font))
	
	for (const w of words) {
	    //console.log("font func: " + w)

	    let metrics    = inMemoryContext.measureText(w);
	    //let wordWidth  = Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight)
	    //let wordHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

	    let wordWidth  = Math.abs(metrics.width)
	    let wordHeight = fontSize
	    
	    if ( (xPos + wordWidth) > maxWidth) {
		xPos = 0
		yPos = yPos + maxWordHeight
	    } 

	    let rect = {'x': xPos, 'y': yPos, 'w': wordWidth, 'h': wordHeight}
	    wordRects.push(rect)

	    //console.log(rect.w, rect.h)
	    
	    xPos = xPos + wordWidth + spaceWidth

	    if (xPos > actualWidth) {
		actualWidth = xPos
	    }
	}

	actualHeight = yPos + maxWordHeight
	
	return {'width'     : actualWidth,
		'height'    : actualHeight,
		'words'     : words,
		'wordRects' : wordRects}	

    }

}

export default Tfont
