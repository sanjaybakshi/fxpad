import Tdiv    from "./Tdiv.js";
import Tslider from "./Tslider.js";

class Tparams_strokeWidth extends Tdiv
{
    constructor(params_strokeWidthId, callOnWidthChangeFn, callOnOpacityChangeFn)
    {
	super(params_strokeWidthId)

	console.log("constructing params")
	
	this._strokeSizeSlider = new Tslider("slider.strokeSizeId",
					     "number.strokeSizeId",
					     callOnWidthChangeFn)

	this._strokeOpacitySlider = new Tslider("slider.strokeOpacityId",
						"number.strokeOpacityId",
						callOnOpacityChangeFn)


	this.hide()

    }
}


export default Tparams_strokeWidth
	
