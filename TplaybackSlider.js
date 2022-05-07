class TplaybackSlider
{
    constructor(playPauseBtnDocName, playSliderDocName, playFrameNumberDocName, canvas) {

	this._playPauseBtn        = document.getElementById(playPauseBtnDocName)
	this._playSliderCtln      = document.getElementById(playSliderDocName)
	this._playFrameNumberCtln = document.getElementById(playFrameNumberDocName)	

	this._canvas = canvas;

	
	this._playPauseBtn.addEventListener('click', (e) => {
	    this.playPauseClick(e)
	});

	this._playSliderCtln.addEventListener('input', (e) => {
	    this.sliderChange(e)
	});

	this._canvas._frameChangeEvent.addListener(data => {
	    this.frameChange(data)
	});

	this._canvas._frameRangeChangeEvent.addListener(data => {
	    this.frameRangeChange(data)
	});
    }

    
    playPauseClick(e)
    {
	if (this._playPauseBtn.src.includes("pause")) {
	    // This means it was playing.  Change it to pause.
	    this._playPauseBtn.src = "play.png"
	    this._canvas._pauseAnim = true;
	} else {
	    // This means it was paused. Change it to play.
	    this._playPauseBtn.src = "pause.png"
	    this._canvas._pauseAnim = false;
	}
    }

    sliderChange(e)
    {
	this._canvas.setFrame(e.target.value)
    }

    frameChange(data)
    {
	//console.log(data)

	this._playSliderCtln.value = data

	this._playFrameNumberCtln.value = data
    }

    frameRangeChange(data)
    {
	this._playSliderCtln.max = data
    }
    
}


export default TplaybackSlider;

