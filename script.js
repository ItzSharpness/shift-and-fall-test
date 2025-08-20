const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player
const player = {
    x: 100,
    y: 300,
    width: 40,
    height: 40,
    speed: 5,
    dy: 0,
    jumpPower: 15,
    gravity: 0.7,
    grounded: false,
    gravityDirection: 1 // 1 = normal, -1 = inversé
};
//Camera qui suis le joueur 
let offsetX = 0;
let offsetY = 0;

// Platform
const platforms = [
    {x: 50, y: 400, width: 400, height: 20},
    {x: 500, y: 300, width: 200, height: 20},
];

// Input
let left = false;
let right = false;
let jump = false;

// Mobile buttons
document.getElementById('leftBtn').addEventListener('touchstart', () => left=true);
document.getElementById('leftBtn').addEventListener('touchend', () => left=false);
document.getElementById('rightBtn').addEventListener('touchstart', () => right=true);
document.getElementById('rightBtn').addEventListener('touchend', () => right=false);
document.getElementById('jumpBtn').addEventListener('touchstart', () => jump=true);
document.getElementById('jumpBtn').addEventListener('touchend', () => jump=false);
document.getElementById('flipBtn').addEventListener('touchstart', () => player.gravityDirection *= -1);

// Keyboard
window.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft') left = true;
    if(e.key === 'ArrowRight') right = true;
    if(e.key === 'ArrowUp' || e.key === ' ') jump = true;
    if(e.key === 'f') player.gravityDirection *= -1;
});
window.addEventListener('keyup', (e) => {
    if(e.key === 'ArrowLeft') left = false;
    if(e.key === 'ArrowRight') right = false;
    if(e.key === 'ArrowUp' || e.key === ' ') jump = false;
});

// Game loop
function gameLoop() {
    // Centrer la caméra sur le joueur
offsetX = player.x - canvas.width / 2 + player.width / 2;
offsetY = player.y - canvas.height / 2 + player.height / 2;
    
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Horizontal movement
    if(left) player.x -= player.speed;
    if(right) player.x += player.speed;

    // Gravity
    player.dy += 0.7 * player.gravityDirection;
    player.y += player.dy;

    // Platform collision
    player.grounded = false;
    platforms.forEach(p => {
        if(player.x < p.x + p.width &&
           player.x + player.width > p.x &&
           player.y < p.y + p.height &&
           player.y + player.height > p.y) {

            if(player.gravityDirection === 1) { // normal
                player.y = p.y - player.height;
            } else { // inversé
                player.y = p.y + p.height;
            }
            player.dy = 0;
            player.grounded = true;
        }
    });

    // Jump
    if(jump && player.grounded){
        player.dy = -player.jumpPower * player.gravityDirection;
        player.grounded = false;
    }

    // Draw player avec caméra
ctx.fillStyle = '#0f0';
ctx.fillRect(player.x - offsetX, player.y - offsetY, player.width, player.height);

// Draw platforms avec caméra
ctx.fillStyle = '#888';
platforms.forEach(p => ctx.fillRect(p.x - offsetX, p.y - offsetY, p.width, p.height));
    
    requestAnimationFrame(gameLoop);
}

gameLoop();
  
