"use strict";
var Canvas = /** @class */ (function () {
    function Canvas(canvasId) {
        this.canvas = document.querySelector(canvasId);
        this.ctx = this.canvas.getContext("2d");
    }
    return Canvas;
}());
var SnakePart = /** @class */ (function () {
    function SnakePart(x, y) {
        this.x = x;
        this.y = y;
    }
    return SnakePart;
}());
var Direction;
(function (Direction) {
    Direction[Direction["up"] = 0] = "up";
    Direction[Direction["down"] = 1] = "down";
    Direction[Direction["left"] = 2] = "left";
    Direction[Direction["right"] = 3] = "right";
})(Direction || (Direction = {}));
//////
var scoreP = document.querySelector("p");
var canvas = new Canvas("canvas");
var width = canvas.canvas.width;
var height = canvas.canvas.height;
var frameSkip = 5;
var frameSkipCount = 0;
////////////
var leftArrow = 37;
var upArrow = 38;
var rightArrow = 39;
var downArrow = 40;
////////////
var snakeSize = 10;
var initialSnakeLength = 3; // unused yet
var snakeParts = [];
var direction = Direction.right;
var score = 0;
var fruitX = 0;
var fruitY = 0;
////////////
window.onload = init;
document.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
        case leftArrow:
            if (direction == Direction.right)
                break;
            direction = Direction.left;
            break;
        case upArrow:
            if (direction == Direction.down)
                break;
            direction = Direction.up;
            break;
        case rightArrow:
            if (direction == Direction.left)
                break;
            direction = Direction.right;
            break;
        case downArrow:
            if (direction == Direction.up)
                break;
            direction = Direction.down;
            break;
    }
});
function random(min, max) {
    return Math.floor(Math.random() * max) + min;
}
function init() {
    for (var i = 0; i < initialSnakeLength; i++)
        snakeParts.push(new SnakePart(0, 0));
    fruitX = random(0, width / snakeSize);
    fruitY = random(0, height / snakeSize);
    window.requestAnimationFrame(loop);
}
function tick() {
    frameSkipCount++;
    if (frameSkipCount >= frameSkip) {
        frameSkipCount = 0;
        for (var i = snakeParts.length; i > 0; i--) {
            if (i >= snakeParts.length)
                continue;
            snakeParts[i].x = snakeParts[i - 1].x;
            snakeParts[i].y = snakeParts[i - 1].y;
        }
        switch (direction) {
            case Direction.right:
                snakeParts[0].x++;
                break;
            case Direction.left:
                snakeParts[0].x--;
                break;
            case Direction.up:
                snakeParts[0].y--;
                break;
            case Direction.down:
                snakeParts[0].y++;
                break;
        }
        if (snakeParts[0].x * snakeSize > width)
            snakeParts[0].x = 0;
        if (snakeParts[0].y * snakeSize > height)
            snakeParts[0].y = 0;
        if (snakeParts[0].x * snakeSize < 0)
            snakeParts[0].x = width / snakeSize;
        if (snakeParts[0].y * snakeSize < 0)
            snakeParts[0].y = height / snakeSize;
        // Fruit Collision
        if (snakeParts[0].x == fruitX && snakeParts[0].y == fruitY) {
            fruitX = random(0, width / snakeSize);
            fruitY = random(0, height / snakeSize);
            score++;
            snakeParts.push(new SnakePart(0, 0));
        }
        for (var i = 1; i < snakeParts.length; i++) {
            if (snakeParts[0].x == snakeParts[i].x && snakeParts[0].y == snakeParts[i].y) {
                alert("Game Over");
                window.location.reload();
            }
        }
    }
}
function render() {
    var _a, _b, _c, _d;
    (_a = canvas.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, width, height);
    for (var _i = 0, snakeParts_1 = snakeParts; _i < snakeParts_1.length; _i++) {
        var s = snakeParts_1[_i];
        (_b = canvas.ctx) === null || _b === void 0 ? void 0 : _b.beginPath();
        (_c = canvas.ctx) === null || _c === void 0 ? void 0 : _c.fillRect(s.x * snakeSize, s.y * snakeSize, snakeSize, snakeSize);
    }
    (_d = canvas.ctx) === null || _d === void 0 ? void 0 : _d.fillRect(fruitX * snakeSize, fruitY * snakeSize, snakeSize, snakeSize);
    scoreP.innerHTML = "Score: <strong>" + score + "</strong>";
}
function loop() {
    tick();
    render();
    window.requestAnimationFrame(loop);
}
