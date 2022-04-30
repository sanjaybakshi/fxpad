// https://hackernoon.com/writing-a-simple-mvc-model-view-controller-app-in-vanilla-javascript-u65i34lx

class Tevent {

    constructor()
    {
	this._listeners = [];
    }

    addListener(listener) {
	this._listeners.push(listener)
    }

    trigger(params) {

	this._listeners.forEach(listener => {listener(params); });
    }
}

export default Tevent;
