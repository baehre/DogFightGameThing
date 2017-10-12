import State from "./state.js"
class GameState extends State {
    constructor() {
        super();
        //this.starBackground = new StarBackground(400, this.level);
        //this.camera = new Camera(this.player, this.canvas, this.level);
    }

    // draw for the state takes dt
    draw(canvas) {
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.translate(Math.round(canvas.width / 2 - this.camera.getX()), Math.round(canvas.height / 2 - this.camera.getY()));
        this.camera.draw(this.entities, this.emitters, this.starBackground);
        this.context.restore();
    }
    
    // render for the state. Takes dt
    update(dt) {

    }
}