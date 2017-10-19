class GameState extends State {
    constructor(canvasWidth, canvasHeight) {
        super(canvasWidth, canvasHeight);
        this.game = new Game(4, 1000, 692);
        this.game.StartLoop();
        this.starBackground = new StarBackground(400, this.game.GetWidth(), this.game.GetHeight());
        this.camera = new Camera(this.player, this.game.GetWidth(), this.game.GetHeight(), this.canvasWidth, this.canvasHeight);
    }

    // draw for the state takes dt
    draw(canvas) {
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.translate(Math.round(canvas.width / 2 - this.camera.getX()), Math.round(canvas.height / 2 - this.camera.getY()));
        this.camera.draw(canvas, this.game.GetEntities(), this.game.GetEmitters(), this.starBackground);
        this.context.restore();
    }
    
    // render for the state. Takes dt
    update(dt) {
        this.starBackground.update(dt);
        this.camera.update(dt);
    }
};