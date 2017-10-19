(function(exports) {
    class Emitter {
        // color is a hex string
        constructor(gameWidth, gameHeight, x, y, amount, life, color) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.particles = [];
            this.x = x;
            this.y = y;
            this.toRemove = false;
            for (var j = 0; j < amount; j++) {
                this.particles.push(new Particle(gameWidth, gameHeight, x, y, life, color));
            }
        }

        update(dt) {
            var particlesLength = this.particles.length;
            for (var i = 0; i < particlesLength; i++) {
                var particle = this.particles[i];
                if(particle.getToRemove()) {
                    this.particles.splice(i, 1);
                    continue;
                }
                particle.update(dt);
            }
        }

    draw(canvas) {
            var context = canvas.getContext("2d");
            var particlesLength = this.particles.length;
            for (var i = 0; i < particlesLength; i++) {
                var particle = this.particles[i];
                particles.draw(context);
            }
            // remove now that there are no more particles to do things.
            if (!this.particles.length) {
                this.toRemove = true;
            }
        }
        
        GetX() {
            return this.x;
        }

        GetY() {
            return this.y;
        }

        getToRemove() {
            return this.toRemove;
        }
    };
    exports.Emitter = Emitter;
})(typeof global === "undefined" ? window : exports);