(function(exports) {
    class Entity {
        constructor(x, y, size, angle) {
            // x and y coordinates
            this.x = x;
            this.y = y;
            // the size set here cuz why not
            this.size = size;
            // whether we should remove the entity
            this.removed = false;
            this.angle = angle || 0.0;
        }

        getX() {
            return this.x;
        }

        getY() {
            return this.y;
        }

        getSize() {
            return this.size;
        }

        setSize(newSize) {
            this.size = newSize;
        }

        setX(x) {
            this.x = x;
        }

        setY(y) {
            this.y = y;
        }

        remove() {
            this.removed = true;
        }

        getRemoved() {
            return this.removed;
        }

        unremove() {
            this.removed = false;
        }

        getAngle() {
            return this.angle;
        }

        setAngle(newAngle) {
            this.angle = newAngle;
        }
    };
    exports.Entity = Entity;
})(typeof global === "undefined" ? window : exports);