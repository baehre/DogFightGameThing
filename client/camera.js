class Camera {
    constructor(entity, gameWidth, gameHeight, canvasWidth, canvasHeight) {
        // can change the entity to follow
        this.entity = entity;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = canvasWidth;
        this.height = canvasHeight;
        // scale based on window size
        this.scale = (this.width + this.height) / 1200;
        this.x = this.entity.getX() || (this.gameWidth / 2);
        this.y = this.entity.getY() || (this.gameHeight / 2);
        this.screenShake = false;
        this.screenShakeFrame = 0;
        this.screenShakeRadius = 10;
    }

    draw(canvas, entities, emitters, background) {
        var context = canvas.getContext("2d");
        //draw the background stars
        var stars = background.getStars();
        // cache for just teh smallest optimization
        var starsLength = stars.length;
        for (var j = 0; j < starsLength; j++) {
            // buffer of 4 since that is the largest star size
            var star = stars[j];
            if (this.inView(star.getX(), star.getY(), 4)) {
                star.draw(context);
            }
        }
        // draw the entities
        var entitiesLength = entities.length;
        for (var i = 0; i < entitiesLength; i++) {
            // buffer of 24 so that a circle with radius of 24 will still be shown
            var entity = entities[i];
            if (this.inView(entity.getX(), entity.getY(), 24)) {
                entity.draw(context);
            }
        }
        var emittersLength = emitters.length;
        for (var k = 0; k < emittersLength; k++) {
            var emitter = emitters[k];
            if (this.inView(emitter.getX(), emitter.getY(), 3)) {
                emitter.draw(context);
            }
        }
    }

    update(dt) {
        //defaults
        this.x = this.entity.getX();
        this.y = this.entity.getY();
        // reset x if outside of bounds 
        if (this.x - (this.width / 2) <= 0) {
            this.x = (this.width / 2);
        }
        if (this.x + (this.width / 2) >= this.gameWidth()) {
            this.x = this.gameWidth - (this.width / 2);
        }
        // reset y if out of bounds
        if (this.y - (this.height / 2) <= 0) {
            this.y = (this.height / 2);
        }
        if (this.y + (this.height / 2) >= this.gameHeight()) {
            this.y = this.gameHeight() - (this.height / 2);
        }
        // implement screen shake
        if (this.screenShake) {
            var angle = Math.random() * Math.PI * 2;
            var offsetX = Math.cos(angle) * this.screenShakeRadius;
            var offsetY = Math.sin(angle) * this.screenShakeRadius;
            this.x += offsetX;
            this.y += offsetY;
            this.screenShakeFrame += 1;
            this.screenShakeRadius *= .9; 
            if (this.screenShakeFrame > 10) {
                this.screenShake = false;
                this.screenShakeFrame = 0;
                this.screenShakeRadius = 10;
            }
        }
    }

    setEntity(entity) {
        this.entity = entity;
    }

    inView(x, y, buffer) {
        // shift this buffer pixels in any direction to allow partially visible sprites
        return x - buffer < this.x + (this.width / 2) && x + buffer > this.x - (this.width / 2) && y - buffer < this.y + (this.height / 2) && y + buffer > this.y - (this.height / 2);
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getScreenShake() {
        return this.screenShake;
    }

    setScreenShake(newScreenShake) {
        this.screenShake = newScreenShake;
    }

    getScreenShakeFrame() {
        return this.screenShakeFrame;
    }

    setScreenShakeFrame(newScreenShakeFrame) {
        this.screenShakeFrame = newScreenShakeFrame;
    }
}
export default Camera