class Canvas {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    
    constructor(canvasId: string) {
        this.canvas = document.querySelector(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
    }
}

class SnakePart {
    x: number;
    y: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

enum Direction {
    up,
    down,
    left,
    right
}

//////

const scoreP = document.querySelector("p");
const canvas: Canvas = new Canvas("canvas");

const width: number = canvas.canvas.width;
const height: number = canvas.canvas.height;

const frameSkip = 5;
var frameSkipCount = 0;

////////////

const leftArrow: number = 37;
const upArrow: number = 38;
const rightArrow: number = 39;
const downArrow: number = 40;

////////////

const snakeSize = 10;
const initialSnakeLength = 3; // unused yet

var snakeParts: SnakePart[] = [];
var direction: Direction = Direction.right;

var score = 0;

var fruitX = 0;
var fruitY = 0;

////////////

window.onload = init;

document.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
        case leftArrow: if (direction == Direction.right) break; direction = Direction.left; break;
        case upArrow: if (direction == Direction.down) break; direction = Direction.up; break;
        case rightArrow: if (direction == Direction.left) break; direction = Direction.right; break;
        case downArrow: if (direction == Direction.up) break; direction = Direction.down; break;
    }
});

function random(min: number | 0, max: number) {
    return Math.floor(Math.random() * max) + min;
}

function init() {
    for (let i = 0; i < initialSnakeLength; i++)
        snakeParts.push(new SnakePart(0, 0));
    
    fruitX = random(0, width / snakeSize);
    fruitY = random(0, height / snakeSize);
    
    window.requestAnimationFrame(loop);
}

function tick() {
    frameSkipCount++;
    if (frameSkipCount >= frameSkip) {
        frameSkipCount = 0;
        
        for (let i = snakeParts.length; i > 0; i--) {
            if (i >= snakeParts.length) continue;
            
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
        
        if (snakeParts[0].x * snakeSize > width) snakeParts[0].x = 0;
        if (snakeParts[0].y * snakeSize > height) snakeParts[0].y = 0;
        
        if (snakeParts[0].x * snakeSize < 0) snakeParts[0].x = width / snakeSize;
        if (snakeParts[0].y * snakeSize < 0) snakeParts[0].y = height / snakeSize;
        
        // Fruit Collision
        
        if (snakeParts[0].x == fruitX && snakeParts[0].y == fruitY) {
            fruitX = random(0, width / snakeSize);
            fruitY = random(0, height / snakeSize);
            
            score++;
            snakeParts.push(new SnakePart(0, 0));
        }
        
        for (let i = 1; i < snakeParts.length; i++) {
            if (snakeParts[0].x == snakeParts[i].x && snakeParts[0].y == snakeParts[i].y) {
                alert("Game Over!");
                
                window.location.reload();
            }
        }
    }
}

function render() {
    canvas.ctx?.clearRect(0, 0, width, height);
    
    for (let s of snakeParts) {
        canvas.ctx?.beginPath();
        canvas.ctx?.fillRect(s.x * snakeSize, s.y * snakeSize, snakeSize, snakeSize);
    }
    
    canvas.ctx?.fillRect(fruitX * snakeSize, fruitY * snakeSize, snakeSize, snakeSize);
    
    scoreP.innerHTML = "Score: <strong>" + score + "</strong>";
}

function loop() {
    tick();
    render();
    
    window.requestAnimationFrame(loop);
}
