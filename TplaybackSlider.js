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
	if (this._playPauseBtn.src.includes("Pause")) {
	    // This means it was playing.  Change it to pause.
	    this._playPauseBtn.src = "./icons/Play2.png"
	    this._canvas.pauseAnim()
	} else {
	    // This means it was paused. Change it to play.
	    this._playPauseBtn.src = "./icons/Pause2.png"
	    this._canvas.playAnim()
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

