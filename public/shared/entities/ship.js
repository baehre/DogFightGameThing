(function(exports) {
    class Ship extends Entity {
        constructor(x, y, imageArr) {
            super(level, x, y, 48, 0);
            this.imageArr = imageArr;
            this.maxHealth = 100;
            this.currentHealth = this.maxHealth;
            // the diagonal length from center to corner. basic geometry (sqrt 2 and what not)
            this.diagonal = (this.size / 2) * 1.41421356237;
        }

        getType() {
            return "ship";
        }

        getImageArr() {
            return this.imageArr;
        }

        getHealth() {
            return this.currentHealth;
        }

        setHealth(newHealth) {
            this.currentHealth = newHealth;
        }

        update(seconds, pressed, entities) {
        
        }

        turnLeft() {
            this.angle += this.turnLeftSpeed * -1;
        }

        turnRight() {
            this.angle += this.turnRightSpeed;
        }

        draw(ctx) {
            ctx.translate(this.x, this.y);
            // convert to radians
            ctx.rotate(this.angle * (Math.PI / 180));
            for (var i = 0; i < this.imageArr.length; i++) {
                // angle can be between 0 and .1096
                this.imageArr[i].draw(ctx, this.x, this.y);
            }
            // rotate it back
            ctx.rotate(-this.angle * (Math.PI / 180));
            // move it back
            ctx.translate(-this.x, -this.y);
            //this.addHealthBars(ctx);
        }

        addHealthBars(ctx) {
            if (this.currentHealth < this.maxHealth && (this.hitCounter > 0 || this.isPlayer())) {
                this.hitCounter -= 1;
                var percent = this.currentHealth / this.fullHealth;
                // ratio in relation to the size of the character
                var pixelWidth = percent * this.size;
                // tinker with this number if we want
                var pixelHeight = 10;
                // top side then the height and a padding of 4
                var healthY = this.y - this.diagonal - pixelHeight - 4;
                if (healthY < 0) {
                    healthY = 1;
                }
                // just the left side of the sprite
                var healthX = this.x - this.diagonal;
                if (healthX < 0) {
                    healthX = 1;
                }
                if (percent < 0.25) {
                    ctx.fillStyle = '#ff0000';
                } else if (percent < 0.75) {
                    ctx.fillStyle = '#ffff00';
                } else {
                    ctx.fillStyle = '#00ff00';
                }
                ctx.fillRect(healthX, healthY, pixelWidth, pixelHeight);
            }
        }

        getCorners() {
            var corners = [];
            var halfSize = this.size / 2;
            var radians = this.angle * (Math.PI / 180);
            var rotC = Math.cos(radians);
            var rotS = Math.sin(radians);

            var tempX = halfSize * rotC - halfSize * rotS;
            var tempY = halfSize * rotS + halfSize * rotC;
            
            // can't really put in an order. but this works
            corners.push({"x": this.x + tempX, "y": this.y + tempY});
            corners.push({"x": this.x - tempY, "y": this.y + tempX});
            corners.push({"x": this.x - tempX, "y": this.y - tempY});
            corners.push({"x": this.x + tempY, "y": this.y - tempX});
            
            return corners;
        }

        // tinker with number there if you want
        fixWorldCollision(seconds, corners) {
            var coll = false;
            for (var i = 0; i < corners.length; i++) {
                var corner = corners[i];
                var buffer = 20;
                if (corner.x <= 0) {
                    if (!coll) {
                        this.x += (this.diagonal + buffer) * seconds;
                        this.velX *= -1;
                        this.velY *= -1;
                        coll = true;
                    }
                    //this.level.addEmitter(corner.x, corner.y, 10, 20, "#939393");
                } else if (corner.x >= this.level.getWidth()) {
                    if (!coll) {
                        this.x -= (this.diagonal + buffer) * seconds;
                        this.velX *= -1;
                        this.velY *= -1;
                        coll = true;
                    }
                    //this.level.addEmitter(corner.x, corner.y, 10, 20, "#939393");
                }
                if (corner.y <= 0) {
                    if (!coll) {
                        this.y += (this.diagonal + buffer) * seconds;
                        this.velX *= -1;
                        this.velY *= -1;
                        coll = true;
                    }
                    //this.level.addEmitter(corner.x, corner.y, 10, 20, "#939393");
                } else if (corner.y >= this.level.getHeight()) {
                    if (!coll) {
                        this.y -= (this.diagonal + buffer) * seconds;
                        this.velX *= -1;
                        this.velY *= -1;
                        coll = true;
                    }
                    //this.level.addEmitter(corner.x, corner.y, 10, 20, "#939393");
                }
            }
        }

        checkUnitCollision(ship1, ship2) {
            var ships = [ship1, ship2];
            var minA, maxA, minB, maxB;
            for (var i = 0; i < ships.length; i++) {
                var ship = ships[i].getCorners();
                for (var j = 0; j < ship.length; j++) {
                    var k = (j + 1) % ship.length;
                    // create an edge
                    var point1 = ship[j];
                    var point2 = ship[k];
                    // get line perpendicular to edge
                    var normal = {"x": point2.y - point1.y, "y": point1.x - point2.x};
                    minA = undefined;
                    maxA = undefined;
                    // for each vertex in the first shape, project it onto the line perpendicular to the edge
                    // and keep track of the min and max of these values
                    var corners1 = ship1.getCorners();
                    for (var l = 0; l < corners1.length; l++) {
                        var projected = normal.x * corners1[l].x + normal.y * corners1[l].y;
                        if (!minA || projected < minA) {
                            minA = projected;
                        }
                        if (!maxA|| projected > maxA) {
                            maxA = projected;
                        }
                    }
                    minB = undefined;
                    maxB = undefined;
                    // for each vertex in the first shape, project it onto the line perpendicular to the edge
                    // and keep track of the min and max of these values
                    var corners2 = ship2.getCorners();
                    for (var m = 0; m < corners2.length; m++) {
                        var projected = normal.x * corners2[m].x + normal.y * corners2[m].y;
                        if (!minB || projected < minB) {
                            minB = projected;
                        }
                        if (!maxB || projected > maxB) {
                            maxB = projected;
                        }
                    }
                    // if there is no overlap between the projects, the edge we are looking at separates the two
                    // polygons, and we know there is no overlap
                    if (maxA < minB || maxB < minA) {
                        return false;
                    }
                }
            }
            return true;
        }

        // do bullet collision here
        fixEntityCollision(seconds, entities, corners) {
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                if (entity.getRemoved()) {
                    continue;
                }
                if (entity.getX() !== this.x && entity.getY() !== this.y && entity.getType() === "ship") {
                    if (this.checkUnitCollision(this, entity)) {
                        var velocityX = (this.x - entity.getX());
                        var velocityY = (this.y - entity.getY());
                        velocityX *= -1 * seconds;
                        velocityY *= -1 * seconds;
                        // adjusting numbers here by a buffer
                        var buffer = 24;
                        if (!(this.x - velocityX < buffer) && !(this.x - velocityX > this.level.getWidth() - buffer)) {
                            this.x -= velocityX;
                        }
                        if (!(this.y - velocityY < buffer) && !(this.y - velocityY > this.level.getHeight() - buffer)) {
                            this.y -= velocityY;
                        }
                    }
                } else if (entity.getType() === "projectile") {
                    var shooter = entity.getEntity();
                    if (shooter.getX() !== this.x && shooter.getY() !== this.y) {
                        var left = this.x - (this.size / 2);
                        var top = this.y - (this.size / 2);
                        var rad = this.angle * (Math.PI / 180);
                        var unrotatedCircleX = Math.cos(rad) * (entity.getX() - this.x) - Math.sin(rad) * (entity.getY() - this.y) + this.x;
                        var unrotatedCircleY = Math.sin(rad) * (entity.getX() - this.x) + Math.cos(rad) * (entity.getY() - this.y) + this.y;
                        // Closest point in the rectangle to the center of circle rotated backwards(unrotated)
                        var closestX;
                        var closestY;

                        // Find the unrotated closest x point from center of unrotated circle
                        if (unrotatedCircleX < left) {
                            closestX = left;
                        } else if (unrotatedCircleX > left + this.size) {
                            closestX = left + this.size;
                        } else {
                            closestX = unrotatedCircleX;
                        }

                        // Find the unrotated closest y point from center of unrotated circle
                        if (unrotatedCircleY < top) {
                            closestY = top;
                        } else if (unrotatedCircleY > top + this.size) {
                            closestY = top + this.size;
                        } else {
                            closestY = unrotatedCircleY;
                        }

                        if (this.distance(unrotatedCircleX, unrotatedCircleY, closestX, closestY) < 8) {
                            entity.remove();
                            this.level.addEmitter(entity.getX(), entity.getY(), 5, 20, '#7171c6');
                            this.setHealth(this.getHealth() - entity.getDamage());
                            // set the hitcounter to show health bars
                            if (this.isPlayer()) {
                                this.level.screenShake();
                            } else {
                                this.hitCounter = 60;
                            }
                            // set the image to hitImage
                            for (var j = 0; j < this.imageArr.length; j++) {
                                // add hit frames and reset hitFrame incase hit multiple times in quick succession
                                this.imageArr[j].hit = true;
                                this.imageArr[j].hitFrame = 0;
                            }
                        }
                    }
                }
            }
        }

        distance(x1, y1, x2, y2) {
            var dX = Math.abs(x1 - x2);
            var dY = Math.abs(y1 - y2);
            return Math.sqrt((dX * dX) + (dY * dY));
        }
    };
    exports.Ship = Ship;
})(typeof global === "undefined" ? window : exports);