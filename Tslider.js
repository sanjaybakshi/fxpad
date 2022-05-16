class Tslider
{
    constructor(sliderId, sliderDataId, callOnChangeFn) {
	this._sliderCtrl     = document.getElementById(sliderId)
	this._sliderDataCtrl = document.getElementById(sliderDataId)

	console.log("constructing slider")
	
	this._callOnSliderChangeFn = callOnChangeFn;

	this._sliderCtrl.addEventListener('input', (e) => {
	    this.sliderChange(e)
	});

	this._sliderDataCtrl.addEventListener('input', (e) => {
	    this.numberChange(e)
	});

    }

    sliderChange(e)
    {
	console.log("slider change")
	this._sliderDataCtrl.value = e.target.value
	this._callOnSliderChangeFn(e.target.value)
    }
    numberChange(e)
    {
	this._sliderCtrl.value = e.target.value
	this._callOnSliderChangeFn(e.target.value)	
    }
}


export default Tslider;
	
