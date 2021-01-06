const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvasW = canvas.width;
const canvasH = canvas.height;

let rightPressed = false;
let leftPressed = false;


let x, y, dx, dy, radius, paddleW, paddleX, paddleY, brickH,
    brickW, brickOffset;
let bricks = [];
let score = 0;
setVariable();
let interval;


drawScore();
darwBall(x, y);
createBrickArray();
drawPaddle();
drawBricks();
paddleNavigation();

function drawScore() {
    ctx.beginPath()
    ctx.fillStyle = "#000";
    ctx.fill()
    ctx.fillText("score: " + score, 10, 10, 50, 50);
    ctx.closePath()
    console.log('heyy');
}

function paddleNavigation() {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyUp)

    function handleKeydown(e) {
        if (e.key == "ArrowRight") {
            rightPressed = true;
        }
        if (e.key == "ArrowLeft") {
            leftPressed = true;
        }
    }

    function handleKeyUp(e) {
        if (e.key == "ArrowRight") {
            rightPressed = false;
        }
        if (e.key == "ArrowLeft") {
            leftPressed = false;
        }
    }
}

function createBrickArray() {

    for (let j = 0; j < 3; j++) {
        bricks[j] = []
        for (let i = 0; i < 8; i++) {
            const brickX = 10 + i * (brickW + brickOffset);
            const brickY = (10 + brickOffset) * (j + 1);
            bricks[j][i] = { x: 0, y: 0, isVisible: true }
        }
    }
}

function drawBricks() {

    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 8; i++) {
            if (bricks[j][i].isVisible) {
                const brickX = 10 + i * (brickW + brickOffset);
                const brickY = (10 + brickOffset) * (j + 1);
                bricks[j][i].x = brickX;
                bricks[j][i].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickW, 10);
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


function detectCollison() {

    if (x + dx >= canvasW || x + dx < 0) {
        dx = -dx;
    }

    if (y + dy > canvasH - radius) {
        if (x + dx > paddleX && x + dx < (paddleX + paddleW)) {
            dy = -dy;
            dx = dx + (x + dx) / 100;
        }
    }


    if (y + dy < 0) {
        dy = -dy;
    }

    for (let b = 0; b < bricks.length; b++) {
        for (let i = 0; i < bricks[b].length; i++) {
            const brick = bricks[b][i];
            if (brick.isVisible) {
                if (x > brick.x && x < (brick.x + brickW) && y > brick.y &&
                    y < (brick.y + brickH)) {
                        bricks[b][i].isVisible = false;
                        score = score + 1;
                        dy = -dy
                        checkYouWon();
                }
            }
        }
    }

}

function startGame() {
    if (!interval) {
        interval = setInterval(() => {
            if (rightPressed) {
                paddleX = paddleX + 5
            }
            if (leftPressed) {
                paddleX = paddleX - 5
            }
            detectCollison();

            y = y + dy
            x = x + dx
            checkGameOver();
            ctx.clearRect(0, 0, canvasW, canvasH)
            drawPaddle();
            darwBall(x, y);
            drawBricks();
            drawScore();
        }, 20);
    }
}

function checkGameOver() {
    if (y == canvasH) {
        alert('GAME OVER !!!');
        clearInterval(interval);
        interval = null
        setVariable();
    }

}

function checkYouWon() {
    if (score === 24) {
        alert('YOU WIN !!!');
        clearInterval(interval);
        interval = null;
        setVariable();
    }
}

function setVariable() {
    x = canvasW / 2
    y = canvasH - 20
    dx = 5
    dy = -5
    radius = 10;
    paddleW = 60;
    paddleX = canvasW / 2 - paddleW / 2;
    paddleY = canvasH - 10;
    brickH = 10;
    brickW = 40;
    brickOffset = 8
}

function drawPaddle() {
    ctx.beginPath()
    ctx.rect(paddleX, paddleY, paddleW, 10)
    ctx.fillStyle = "white"
    ctx.fill()
    ctx.closePath()
}

function darwBall(x, y) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    ctx.fillStyle = "#342D7E"
    ctx.fill()
    ctx.closePath()
}