const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

const paddleWidth = 12;
const paddleHeight = 90;
const ballSize = 15;

let leftScore = 0;
let rightScore = 0;

const leftPaddle = {
    x: 20,
    y: height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

const rightPaddle = {
    x: width - 20 - paddleWidth,
    y: height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

const ball = {
    x: width / 2 - ballSize / 2,
    y: height / 2 - ballSize / 2,
    size: ballSize,
    dx: 5 * (Math.random() > 0.5 ? 1 : -1),
    dy: 3 * (Math.random() > 0.5 ? 1 : -1)
};

function resetBall() {
    ball.x = width / 2 - ballSize / 2;
    ball.y = height / 2 - ballSize / 2;
    ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function drawRect(x, y, w, h, color = "#fff") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color = "#fff") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function draw() {
    // Background
    ctx.clearRect(0, 0, width, height);

    // Net
    for (let i = 0; i < height; i += 25) {
        drawRect(width / 2 - 2, i, 4, 15, "#888");
    }

    // Paddles
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Ball
    drawCircle(ball.x + ball.size / 2, ball.y + ball.size / 2, ball.size / 2);
}

function update() {
    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top/bottom walls
    if (ball.y <= 0) {
        ball.y = 0;
        ball.dy *= -1;
    } else if (ball.y + ball.size >= height) {
        ball.y = height - ball.size;
        ball.dy *= -1;
    }

    // Ball collision with paddles
    // Left paddle
    if (
        ball.x <= leftPaddle.x + leftPaddle.width &&
        ball.x + ball.size >= leftPaddle.x &&
        ball.y + ball.size >= leftPaddle.y &&
        ball.y <= leftPaddle.y + leftPaddle.height
    ) {
        ball.x = leftPaddle.x + leftPaddle.width;
        ball.dx *= -1;
        // Add some "spin" effect based on paddle movement
        ball.dy += leftPaddle.dy * 0.3;
    }

    // Right paddle
    if (
        ball.x + ball.size >= rightPaddle.x &&
        ball.x <= rightPaddle.x + rightPaddle.width &&
        ball.y + ball.size >= rightPaddle.y &&
        ball.y <= rightPaddle.y + rightPaddle.height
    ) {
        ball.x = rightPaddle.x - ball.size;
        ball.dx *= -1;
        // Add some "spin" effect based on paddle movement
        ball.dy += rightPaddle.dy * 0.3;
    }

    // Ball goes out of bounds (score)
    if (ball.x < 0) {
        rightScore++;
        document.getElementById('right-score').textContent = rightScore;
        resetBall();
    } else if (ball.x + ball.size > width) {
        leftScore++;
        document.getElementById('left-score').textContent = leftScore;
        resetBall();
    }

    // AI for right paddle (very basic)
    let center = rightPaddle.y + rightPaddle.height / 2;
    if (center < ball.y + ball.size / 2 - 10) {
        rightPaddle.dy = 5;
    } else if (center > ball.y + ball.size / 2 + 10) {
        rightPaddle.dy = -5;
    } else {
        rightPaddle.dy = 0;
    }
    rightPaddle.y += rightPaddle.dy;

    // Clamp right paddle
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + rightPaddle.height > height) rightPaddle.y = height - rightPaddle.height;
}

let mouseY = height / 2;

canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Move left paddle with mouse
function moveLeftPaddle() {
    // Paddle follows mouseY smoothly
    const center = leftPaddle.y + leftPaddle.height / 2;
    const diff = mouseY - center;
    leftPaddle.dy = diff * 0.2; // smooth movement
    leftPaddle.y += leftPaddle.dy;

    // Clamp
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + leftPaddle.height > height) leftPaddle.y = height - leftPaddle.height;
}

function gameLoop() {
    moveLeftPaddle();
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();