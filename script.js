const playerCar = document.getElementById('player-car');
const road = document.getElementById('road');
const scoreDisplay = document.getElementById('score');
let score = 0;
let lane = 1; // 0: left, 1: center, 2: right
let obstacles = [];

// Function to create an obstacle
function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    obstacle.style.left = `${Math.floor(Math.random() * 3) * 100}px`; // Random lane
    obstacle.style.top = `-100px`; // Start above the road
    road.appendChild(obstacle);
    obstacles.push(obstacle);
}

// Move obstacles down
function moveObstacles() {
    obstacles.forEach(obstacle => {
        const top = parseInt(obstacle.style.top);
        obstacle.style.top = `${top + 5}px`; // Move down

        // Check for collision
        if (top > 600) {
            score++;
            scoreDisplay.innerText = `Score: ${score}`;
            obstacle.remove();
        } else if (top > 500 && parseInt(obstacle.style.left) === lane * 100) {
            alert('Game Over! Your score: ' + score);
            resetGame();
        }
    });
}

// Reset the game
function resetGame() {
    obstacles.forEach(obstacle => obstacle.remove());
    obstacles = [];
    score = 0;
    scoreDisplay.innerText = `Score: ${score}`;
}

// Control the player car
function moveCar(direction) {
    if (direction === 'left' && lane > 0) {
        lane--; // Move to the left lane
    } else if (direction === 'right' && lane < 2) {
        lane++; // Move to the right lane
    }
    playerCar.style.left = `${lane * 100}px`; // Update the car's position
}

// Game loop
function gameLoop() {
    if (Math.random() < 0.05) createObstacle(); // Create new obstacle randomly
    moveObstacles();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

// Hand gesture recognition using Web Speech API
if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.onresult = (event) => {
        const command = event.results[event.resultIndex][0].transcript.toLowerCase();
        if (command.includes('left')) {
            moveCar('left');
        } else if (command.includes('right')) {
            moveCar('right');
        }
    };
    recognition.start();
}
