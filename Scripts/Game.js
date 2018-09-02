const gamePanel = document.getElementById("gamePanel");
const c = gamePanel.getContext("2d");

const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

let startTime;
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

let deltaTime = 0;
let FPS = 60;
let redrawInterval = 1000 / FPS;
let GRAVITY = 0.4;
let levelObjects = [];
let player;
let cameraOffsetX = 0;
let cameraOffsetY = 0;
let tileHeight = 44;
let tileWidth = 44;

let map = [];
let mapWidth = 0, mapHeight = level.length;

window.addEventListener("keydown", keyDownHandler, false);
window.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
	const k = e.key;

	switch (k) {
		case 'ArrowLeft':
			leftPressed = true;
			break;
		case 'ArrowRight':
			rightPressed = true;
			break;
		case 'ArrowUp':
			upPressed = true;
			break;
		case 'ArrowDown':
			downPressed = true;
			break;
	}
}

function keyUpHandler(e) {
	const k = e.key;

	switch (k) {
		case 'ArrowLeft':
			leftPressed = false;
			break;
		case 'ArrowRight':
			rightPressed = false;
			break;
		case 'ArrowUp':
			upPressed = false;
			break;
		case 'ArrowDown':
			downPressed = false;
			break;
	}
}

function gameLoop() {

	const drawStart = Date.now();
	deltaTime = (drawStart - startTime) / redrawInterval;
	if(deltaTime < 0){
		deltaTime = 0;
	} else if(deltaTime > 1){
		deltaTime = 1;
	}
	// deltaTime = (deltaTime > 1) ? 1 : deltaTime;
	update();
	draw();


	startTime = drawStart;
	requestAnimationFrame(gameLoop);
}

function initGame() {

	// Initializes the map
	for (let i = 0; i < level.length; i++) {
		for (let j = 0; j < level[i].length; j++) {
			mapWidth = (j > mapWidth) ? j : mapWidth;
			map[j] = [];
		}
	}

	// Creates the map
	for (let j = 0; j < level.length; j++) {
		for (let i = 0; i < level[j].length; i++) {
			if(level[j].charAt(i) === "#"){
				map[j][i] = new Ground(i * tileWidth, j * tileHeight, tileWidth, tileHeight, "#303030");
			}

			if(level[j].charAt(i) === "@"){
				player = new Player(i * tileWidth, j * tileHeight, 32, 44, null);
			}

		}
	}

}


window.onload = function () {
	initGame();
	startTime = Date.now();
	requestAnimationFrame(gameLoop);
};


function update() {
	for (let i = 0; i < levelObjects.length; i++) {
		levelObjects[i].update();
	}
	player.update();
}

function draw() {
	// draws background
	c.fillStyle = "#fafafa";
	c.fillRect(0, 0, gamePanel.width, gamePanel.height);

	// draws the level
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			if(map[i][j] != null){
				map[i][j].draw();
			}
		}
	}

	// draws the player
	player.draw();

}