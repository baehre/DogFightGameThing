
(function(exports) {
    class Game {
        constructor(maxNumPlayers, width, height) {
            // info about the game being started
            this.maxNumPlayers = maxNumPlayers || 4;
            this.width = width || 1000;
            this.height = height || 692;
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
            var entitiesLength = this.entities.length;
            for (var i = 0; i < entitiesLength; i++) {
                var entity = this.entities[i];
                if (entity.getRemoved()) {
                    this.entities.splice(i, 1);
                    continue;
                }
                entity.update(dt, this.entities, this.keys);
            }
            var emittersLength = this.emitters.length;
            for (var j = 0; j < emittersLength; j++) {
                if (emitter.getRemoved()) {
                    this.emitters.splice(j, 1);
                    continue;
                }
                emitter.update(seconds);
            }
        }

        // width of the level for this game
        GetWidth() {
            return this.width;
        }

        // height of the level for this game
        GetHeight() {
            return this.height;
        }

        GetEntities() {
            return this.entities;
        }

        GetEmitters() {
            return this.emitters;
        }

        addEmitter(x, y, amount, life, color) {
            this.emitters.push(new Emitter(this.width, this.height, x, y, amount, life, color));
        }

        addProjectile(entity, x, y, angle) {
            //this.entities.push(new Projectile(entity, this.level, x, y, angle));
        }
    };

    exports.Game = Game;
})(typeof global === "undefined" ? window : exports);
