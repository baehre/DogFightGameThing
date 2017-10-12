// STATES
var MENU = 0;
var GUI = 1; 
var GAME = 2;

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

