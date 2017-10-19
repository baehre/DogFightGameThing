(function(exports) {
    class Projectile extends Entity {
        constructor(entity, x, y, angle) {
            super(x, y, 16, angle);
            this.range = 450;
            this.damage = 10;
            this.speed = 300;
            this.entity = entity;
            this.xOrigin = x;
            this.yOrigin = y;
            this.xDis = -this.speed * Math.cos(angle * (Math.PI / 180));
            this.yDis = -this.speed * Math.sin(angle * (Math.PI / 180));
            this.projectileImage = new Image();
            this.projectileImage.src = "SpriteSheets/bullet/bulletImage.png";
        }

        getType() {
            return "projectile";
        }

        getDamage() {
            return this.damage;
        }

        draw(ctx) {
            ctx.drawImage(this.projectileImage, 0, 0, this.size, this.size, this.x - (this.size / 2), this.y - (this.size / 2), this.size, this.size);
        }

        update(seconds, entities) {
            if (!this.intersection(this.x, this.y)) {
                this.x += this.xDis * seconds;
                this.y += this.yDis * seconds;
            } else {
                //this.level.addEmitter(this.x, this.y, 5, 20, '#939393');
                this.remove();
            }
            if (this.distance() > this.range) {
                //this.level.addEmitter(this.x, this.y, 5, 20, '#7171c6');
                this.remove();
            }
        }

        distance() {
            return Math.sqrt(Math.abs((this.xOrigin - this.x) * (this.xOrigin - this.x) + (this.yOrigin - this.y)
                    * (this.yOrigin - this.y)));
        }

        intersection(x, y) {
            //return x < 8 || x > this.level.getWidth() - 8 || y < 8 || y > this.level.getHeight() - 8
        }

        getEntity() {
            return this.entity;
        }
    };
    exports.Projectile = Projectile;
})(typeof global === "undefined" ? window : exports);