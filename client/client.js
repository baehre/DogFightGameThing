import MenuState from "./states/menuState.js"
import GUIState from "./states/guiState.js"
import GameState from "./states/gameState.js"

class Client {
    constructor() {
        // 2 canvases for buffering
        this.canvases = setupCanvases()
        // to choose the canvas to show
        this.canvasChoice = 1;
        this.states = setupStates();
        // current state on load
        this.state = MENU;
        this.keys = new Keys();
        window.addEventListener("keydown", this.keyDown.bind(this), false);
        window.addEventListener("keyup", this.keyUp.bind(this), false);
        this.currentTime = 0.0;
        this.accumulator = 0.0;
        this.time = 0.0;
        // for standardizing update time
        this.deltaTime = 1.0/60.0;
        // array of states to tell us what to do
        this.loopID = -1;
        this.started = false;
    }

    StartClientLoop() {
        if (this.started) {
            return;
        }
        this.started = true;
        this.loopID = requestAnimationFrame(this.clientLoop.bind(this));
    }

    StopClientLoop() {
        this.started = false;
        if (this.loopID !== -1) {
            cancelAnimationFrame(this.loopID)
        }
    }

    clientLoop(newTime) {
        var frameTime = newTime - this.currentTime;
        this.currentTime = newTime;
        this.accumulator = this.accumulator + frameTime
        while (this.accumulator >= this.deltaTime) {
            this.states[this.state].update(deltaTime)
            this.accumulator = this.accumulator - this.deltaTime;
            this.time = this.time + this.deltaTime;
        }
        this.canvases[1 - this.canvasChoice].style.visibility = "hidden";
        var currentCanvas = this.canvases[this.canvasChoice];
        currentCanvas.style.visibility = 'visible';
        this.canvasChoice = 1 - this.canvasChoice;
        this.states[this.state].draw(currentCanvas)
        this.loopID = requestAnimationFrame(this.clientLoop.bind(this));
    }

    keyDown(e) {
        this.keys.onKeyDown(e);
    }

    keyUp(e) {
        this.keys.onKeyUp(e);
    }

    // returns an array of 2 canvases. Used for buffering
    setupCanvases() {
        var canvas1 = document.createElement("canvas");
        var canvas2 = document.createElement("canvas");
        return [canvas1, canvas2];
    }

    setupStates() {
        var menuState = new MenuState();
        var guiState = new GUIState();
        var gameState = new GameState();
        return [menuState, guiState, gameState];
    }
}
var client = new Client();