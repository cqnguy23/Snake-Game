const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
canvas.style = "border:1px solid #000000;"
document.getElementById("canvas").appendChild(canvas);

let score = 0;
let edge = 20;
let snake = [{ x: 200, y: 200 }, { x: 180, y: 200 }, { x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }]
let dx = 0;
let dy = 20;
let movingHorizontal = false;
let movingVertical = true;
let rightPressed = false;
let leftPressed = false;
let targetWidth = 10;
let targetHeight = 10;
let upPressed = false;
let downPressed = false;
let head = { x: 0, y: 0 };
let hasEaten = false;
let snakeColor = "white"
let colors =
{
    0: "orange",
    1: "purple",
    2: "red",
    3: "green",
    4: "blue"
}
let mine = gen_food("black")
let targets = [gen_food(randomColor()), gen_food(randomColor())]
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
var background = new Image();

function loadImages() {
    targets.forEach((target, i) => {
        target.image = new Image();
        target.image.onload = function () {
            target.ready = true;
        }
        switch (target.color) {
            case "red":
                target.image.src = "images/apple.png";
                break;
            case "orange":
                target.image.src = "images/orange.png";
                break;
            case "purple":
                target.image.src = "images/grape.svg";
                break;
            case "green":
                target.image.src = "images/kiwi.png";
                break;
            case "blue":
                target.image.src = "images/blueberry.png";
                break;
        }
    });

    mine.image = new Image();
    mine.image.onload = function () {
        mine.ready = true;
    };
    mine.image.src = 'images/bomb.png'

    background.src = 'images/canvas.png'
    background.onload = function(){
        background.ready = true; 
    }
}
function randomColor() {
    let a = Math.floor(Math.random() * 5)
    console.log(colors[a]);
    return colors[a];
}
function drawMine() {
    if (mine.ready) {
        ctx.drawImage(mine.image, mine.x, mine.y, 20, 20);
    }
}

function random_food(min, max) {
    return Math.round((Math.random() * (max - min) + min) / edge) * edge;
}
function drawBackground() {
    ctx.drawImage(background,0,0, canvas.width, canvas.height);   
}
function drawScore() {
    ctx.font = "14px Arial";
    ctx.fillStyle = "red"
    ctx.fillText("Score: " + score, 8, 20);
}
function reduceCanvasSize() {
    canvas.width -= 20;
    canvas.height -= 20;
    draw();
}
function gen_food(str) {
    let food_x = 0, food_y = 0;
    do {
        food_x = random_food(0, canvas.width - edge);
        food_y = random_food(0, canvas.height - edge);
    }
    while ((food_x == head.x && food_y == head.y) && (food_x == mine.x && food_y == mine.y))
    return { x: food_x, y: food_y, color: str };
}
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
        rightPressed = true;
        
    }
    if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
        leftPressed = true;

    }
    if (e.key == "Up" || e.key == "ArrowUp" || e.key == "w") {
        upPressed = true;


    }
    if (e.key == "Down" || e.key == "ArrowDown" || e.key == "s") {
        downPressed = true;

    }
}


function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
        rightPressed = false;
        
    }
    if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
        leftPressed = false;
     
    }
    if (e.key == "Up" || e.key == "ArrowUp" | e.key == "w") {
        upPressed = false;

    }
    if (e.key == "Down" || e.key == "ArrowDown" || e.key == "s") {
        downPressed = false;

    }
}
function drawPiece(snakePiece) {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = "black";
    ctx.fillRect(snakePiece.x, snakePiece.y, edge, edge);
    ctx.strokeRect(snakePiece.x, snakePiece.y, edge, edge);
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        drawPiece(snake[i]);
    }
}

function drawTarget() {
    targets.forEach((target) => {
        if (target.ready) {
            ctx.drawImage(target.image, target.x, target.y, edge, edge)
        }
    });
}
gen_food();
function draw() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (score == 20) {
        alert("Congratulations! You've Won!");
        clearInterval(interval);
        document.location.reload();
        return;
    }
    loadImages();
    drawBackground();
    if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) {
        alert("You hit your head in the electrified fence. Game Over!");
        clearInterval(interval);
        document.location.reload();
        return;
    }
    if (snake[0].x == mine.x && snake[0].y == mine.y) {
        alert("You stepped on a mine! Game over!");
        clearInterval(interval);
        document.location.reload();
        return;
    }
    if (mine.x >= canvas.width - edge || mine.y >= canvas.height - edge || mine.x < 0 || mine.y < 0) {
        mine = gen_food(mine.color);
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            alert("You hit your own bum! Game Over");
            clearInterval(interval);
            document.location.reload();
            return;
        }
    }
    for (let i = 0; i < targets.length; i++) {
        if (targets[i].x > canvas.width - edge || targets[i].y > canvas.height - edge || targets[i].x < 0 || targets[i].y < 0) {
            targets[i] = gen_food(targets[i].color);
        }
    }
    drawMine();
    drawSnake();
    drawScore();
    drawTarget();

    move();
    if (rightPressed && dx != -edge) {
        dx = edge;
        dy = 0;
    }
    else if (leftPressed && dx != edge) {
        dx = -edge;
        dy = 0;
    }
    else if (upPressed && dy != edge) {
        dx = 0;
        dy = -edge;
    }
    else if (downPressed && dy != -edge) {
        dx = 0;
        dy = edge;
    }
    
        for (let j = 0; j < targets.length; j++) {
            if (snake[0].x == targets[j].x && snake[0].y == targets[j].y) {
                snakeColor = targets[j].color;
                targets[j] = gen_food(randomColor());
                hasEaten = true;
                score++;
            }
        }

    
}

function move() {
    head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (hasEaten) {
        hasEaten = false;
    }
    else {
        snake.pop();
    }
}
var interval = setInterval(draw, 70);
var boardInterval = setInterval(reduceCanvasSize, 5000)