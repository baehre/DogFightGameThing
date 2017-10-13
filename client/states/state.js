class State {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    // draw for hte state takes dt
    draw (canvas) {
    }
    
    // render for the state. Takes dt
    render (dt) {
    }

    GetCanvasHeight() {
        return this.canvasHeight;
    }

    GetCanvasWidth() {
        return this.canvasWidth;
    }
}
export default State