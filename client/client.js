import MenuState from "./states/menuState.js"
import GUIState from "./states/guiState.js"
import GameState from "./states/gameState.js"
import Keys from "./keys.js"

class Client {
    constructor() {
        // 2 canvases for buffering
        this.canvases = setupCanvases()
        // to choose the canvas to show
        this.canvasChoice = 1;
        // array of states to tell us what to do
        this.states = setupStates(this.canvases[0]);
        // current state on load
        //this.state = MENU;
        this.state = GAME;
        this.keys = new Keys();
        window.addEventListener("keydown", this.keyDown.bind(this), false);
        window.addEventListener("keyup", this.keyUp.bind(this), false);
        this.currentTime = 0.0;
        this.accumulator = 0.0;
        this.time = 0.0;
        // for standardizing update time
        this.deltaTime = 1.0/60.0;
        this.clientLoopID = -1;
        this.started = false;
    }

    StartClientLoop() {
        if (this.started) {
            return;
        }
        this.started = true;
        this.clientLoopID = requestAnimationFrame(this.clientLoop.bind(this));
    }

    StopClientLoop() {
        this.started = false;
        if (this.clientLoopID !== -1) {
            cancelAnimationFrame(this.clientLoopID)
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
        this.clientLoopID = requestAnimationFrame(this.clientLoop.bind(this));
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
        canvas1.width = canvas2.width = 900;
        canvas1.height = canvas2.height = 504;
        return [canvas1, canvas2];
    }

    setupStates(canvas) {
        var menuState = new MenuState(canvas.width, canvas.height);
        var guiState = new GUIState(canvas.width, canvas.height);
        var gameState = new GameState(canvas.width, canvas.height);
        return [menuState, guiState, gameState];
    }
}
var client = new Client();