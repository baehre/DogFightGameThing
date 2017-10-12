import utils from "./utils.js"

class Game {
    constructor() {
        // the seconds to be calculated
        this.currentTime = 0.0;
        this.accumulator = 0.0;
        this.time = 0.0;
        // for standardizing update time
        this.deltaTime = 1.0/60.0;
        // array of states to tell us what to do
        this.loopID = -1;
        this.started = false;
        // anything that is an entity
        this.entities = [];
        // emitters (for the lovely particles)
        this.emitters = [];
    }

    // starts the update loop
    StartLoop() {
        if (this.started) {
            return;
        }
        this.started = true;
        this.loopID = requestAnimationFrame(this.loop.bind(this));
    }

    // stops the update loop
    StopLoop() {
        this.started = false;
        if (this.loopID !== -1) {
            cancelAnimationFrame(this.loopID);
        }
    }

    /* time comes from the requestAnimationFrame automatically */
    loop(newTime) {
        var frameTime = newTime - this.currentTime;
        this.currentTime = newTime;
        this.accumulator = this.accumulator + frameTime
        while (this.accumulator >= this.deltaTime) {
            this.update(deltaTime)
            this.accumulator = this.accumulator - this.deltaTime;
            this.time = this.time + this.deltaTime;
        }
        this.loopID = requestAnimationFrame(this.loop.bind(this));
    }

    update(dt) {
        
    }
}