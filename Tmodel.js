import Tbox2d_world from "./Tbox2d_classes.js";
import TselectionList from "./TselectionList.js";


/*
export default {

    fBox2dWorld: 0

    fSelectionList: 0
}
*/



class Tmodel {
    constructor()
    {
    }

    init(width, height, selListChanged_callback)
    {
	this.fBox2dWorld = new Tbox2d_world(width,height)
	this.fSelectionList  = new TselectionList(selListChanged_callback)
	
    }
}

const fModel = new Tmodel()

export { fModel };
