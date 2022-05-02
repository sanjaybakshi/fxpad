class Ttouch
{
    constructor() {

    }

    static getOffset(obj) {
	var offsetLeft = 0;
	var offsetTop = 0;
	do {
	    if (!isNaN(obj.offsetLeft)) {
		offsetLeft += obj.offsetLeft;
	    }
	    if (!isNaN(obj.offsetTop)) {
		offsetTop += obj.offsetTop;
	    }   
	} while(obj = obj.offsetParent );
	return {left: offsetLeft, top: offsetTop};
    }

    static getTouch(e) {
	
	let pressure = 0.1
	let x, y;
	
	if (e.touches && e.touches[0] && typeof e.touches[0]["force"] !== "undefined") {
	    if (e.touches[0]["force"] > 0) {
		pressure = e.touches[0]["force"]
	    }
	    
	    let offset = Ttouch.getOffset(e.target)

	    x = e.touches[0].pageX - offset.left
	    y = e.touches[0].pageY - offset.top

	} else {
	    pressure = 1.0
	    x = e.offsetX
	    y = e.offsetY
	}

	//console.log(e.target)
	
	return {x: x, y: y, pressure: pressure};
    }

/*
          const touch = e.touches ? e.touches[0] : null
      if (touch) {
        $touches.innerHTML = `
          touchType = ${touch.touchType} ${touch.touchType === 'direct' ? '👆' : '✍️'} <br/>
          radiusX = ${touch.radiusX} <br/>
          radiusY = ${touch.radiusY} <br/>
          rotationAngle = ${touch.rotationAngle} <br/>
          altitudeAngle = ${touch.altitudeAngle} <br/>
          azimuthAngle = ${touch.azimuthAngle} <br/>
        `
      }
*/
}

export default Ttouch
