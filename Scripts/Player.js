class Player extends GameObject {
	constructor(x, y, width, height, obstacles) {
		super(x, y, width, height, false);

		this.moveSpeed = 6;
		this.maxSpeed = 6;
		this.firstJumpForce = -12;
		this.secondJumpForce = -9;
		this.jumpDownForce = 2;
		this.grounded = true;
		this.facingLeft = false;
		this.isJumping = false;
		this.jumpCount = 0;
		this.MAX_JUMP_COUNT = 1000;
		this.images = [];
		for (let i = 0; i < 2; i++) {
			this.images.push(new Image());
		}

		this.images[0].src = "sprites/mariosprite.png";
		this.images[1].src = "sprites/mariospriteflipped.png";

		this.anim = 0;
		// this.spriteCount = 2;
		this.currentFrame = 0;

		this.canGoLeft = true;
		this.canGoRight = true;
		this.hMargin = gamePanel.width / 4;
		this.vMargin = gamePanel.height / 5;

	}

	update() {
		this.handleKeys();
		this.calculateBounds();
		this.vy += GRAVITY * deltaTime;
		this.collision();
		this.move();
		this.moveCamera();

		console.log(`
		delta: ${deltaTime.toPrecision(4)}
		X: ${this.x}
		Y: ${this.y}
		VY: ${this.vy}
		MOVESPEED: ${this.moveSpeed}
		GROUNDED: ${this.grounded}
		can go LEFT: ${this.canGoLeft}
		can go RIGHT: ${this.canGoRight}
		`);
	}

	draw() {
		c.save();
		c.translate(-cameraOffsetX, -cameraOffsetY);

		this.anim += deltaTime;

		if (this.anim >= 10) {
			this.anim = 0;
			// this.currentFrame++;
			// if(this.currentFrame === this.spriteCount){
			// 	this.currentFrame = 0;
			// }

			if (this.vy > GRAVITY) {
				this.currentFrame = 3;
			} else if (this.vy < 0) {
				this.currentFrame = 2;
			} else if (this.vy === GRAVITY && leftPressed || rightPressed) {
				if (this.currentFrame !== 0) {
					this.currentFrame = 0;
				} else {
					this.currentFrame = 1;
				}
			} else if (this.vy === GRAVITY) {
				this.currentFrame = 0;
			}

		}

		if (this.facingLeft) {
			c.drawImage(this.images[0], (this.currentFrame * this.width), 0, this.width, this.height, this.x, this.y, this.width, this.height);
		} else {
			c.drawImage(this.images[1], (this.currentFrame * this.width), 0, this.width, this.height, this.x, this.y, this.width, this.height);
		}

		// c.fillStyle = "#ff0021";
		// c.fillRect(this.x, this.y, this.width, this.height);
		c.restore();
	}

	collision() {

		let verticalIntersecting = false;
		let horizontalIntersecting = false;
		let isGround = false;
		let verticals = [];
		let horizontals = [];

		let xStart = ((this.y - (this.y % tileHeight)) / tileHeight) - 1;
		let xEnd = ((this.bottom - (this.bottom % tileHeight)) / tileHeight) + 2;
		let yStart = ((this.x - (this.x % tileWidth)) / tileWidth) - 1;
		let yEnd = ((this.right - (this.right % tileWidth)) / tileWidth) + 2;

		yStart = (yStart < 0) ? 0 : yStart;
		yEnd = (yEnd > mapWidth + 1) ? mapWidth + 1 : yEnd;
		xStart = (xStart < 0) ? 0 : xStart;
		xEnd = (xEnd > mapHeight + 1) ? mapHeight + 1 : xEnd;


		// VERTICAL
		for (let y = yStart; y < yEnd; y++) {
			for (let x = xStart; x < xEnd; x++) {

				if (map[x][y] != null) {
					if (this.intersectsTwo(this.x, this.y + (this.vy * deltaTime), this.width, this.height,
						map[x][y].x, map[x][y].y, map[x][y].width, map[x][y].height)) {

						verticals.push(map[x][y]);

						verticalIntersecting = true;
						if (map[x][y].y >= this.y) {

							// Intersected the ground
							isGround = true;
							if (this.y > map[x][y].y - this.height) {
								this.y = map[x][y].y - this.height;
							}
						} else {
							// Intersected the ceiling
							if (this.y < map[x][y].bottom) {
								this.y = map[x][y].bottom;
							}
						}
					}
				}
			}

			if (verticalIntersecting) {
				this.vy = GRAVITY;
				if (isGround) {
					this.grounded = true;
					this.jumpCount = 0;
				}
			}
		}

		//HORIZONTAL
		for (let y = yStart; y < yEnd; y++) {
			for (let x = xStart; x < xEnd; x++) {

				if (map[x][y] != null) {
					map[x][y].color = "#4a4a4a";
					if (this.intersectsTwo(this.x + this.moveSpeed * deltaTime, this.y, this.width, this.height,
						map[x][y].x, map[x][y].y, map[x][y].width, map[x][y].height)) {

						horizontals.push(map[x][y]);

						horizontalIntersecting = true;
						if (map[x][y].x >= this.x) {
							// Right wall
							if (this.x > map[x][y].x - this.width) {
								this.x = map[x][y].x - this.width;
							}
							this.canGoRight = false;
						} else {
							// Left wall
							if (this.x < map[x][y].right) {
								this.x = map[x][y].right;
							}
							this.canGoLeft = false;
						}
					}
				}
			}
		}

		if (!horizontalIntersecting) {
			this.canGoLeft = true;
			this.canGoRight = true;
		}


		for (let i = 0; i < horizontals.length; i++) {
			horizontals[i].color = "#ff00c4";
		}

		for (let i = 0; i < verticals.length; i++) {
			verticals[i].color = "#0006ff";
		}
	}

	moveCamera() {
		if (this.x - gamePanel.width + this.hMargin >= cameraOffsetX) {
			cameraOffsetX = this.x - gamePanel.width + this.hMargin;
		} else if (this.x - this.hMargin <= cameraOffsetX) {
			cameraOffsetX = this.x - this.hMargin;
		}

		if (this.y - gamePanel.height + this.vMargin >= cameraOffsetY) {
			cameraOffsetY = this.y - gamePanel.height + this.vMargin;
		} else if (this.y - this.vMargin <= cameraOffsetY) {
			cameraOffsetY = this.y - this.vMargin;
		}
	}


	intersects(other) {
		return this.intersectsRectangle(other.x, other.y, other.width, other.height);
	}

	intersectsRectangle(x, y, w, h) {
		if (w <= 0 || h <= 0) {
			return false;
		}

		let x0 = this.x;
		let y0 = this.y;

		return (
			x + w > this.x &&
			y + h > this.y &&
			x < this.right &&
			y < this.bottom);
	}

	intersectsTwo(x1, y1, w1, h1, x2, y2, w2, h2) {
		if (w2 <= 0 || h2 <= 0) {
			return false;
		}

		return (

			(x2 + w2 > x1 &&
				y2 + h2 > y1 &&
				x2 < x1 + w1 &&
				y2 < y1 + h1)
		);
	}

	move() {
		this.x += this.vx * deltaTime;
		this.y += this.vy * deltaTime;
	}

	moveLeft() {
		this.moveSpeed = -this.maxSpeed;
		if (this.canGoLeft) this.x += this.moveSpeed * deltaTime;
	}

	moveRight() {
		this.moveSpeed = this.maxSpeed;
		if (this.canGoRight) this.x += this.moveSpeed * deltaTime;
	}

	moveDown() {
		// if (this.canGoRight) this.x += this.moveSpeed * deltaTime;
		this.y += this.maxSpeed * deltaTime;
	}


	jump() {
		if (this.jumpCount < this.MAX_JUMP_COUNT) {
			if (this.grounded) {
				this.isJumping = true;
				this.jumpCount++;
				this.vy = this.firstJumpForce;
				this.move();
				this.grounded = false;
			}
			if (!this.isJumping && !this.grounded) {
				this.isJumping = true;
				this.vy = this.secondJumpForce;
				this.jumpCount++;
				this.move();
			}
		}
	}

	jumpRelease() {
		if (this.isJumping) {
			this.isJumping = false;
			if (this.vy < 0) {
				this.vy = this.jumpDownForce;
			}
		}
	}

	handleKeys() {
		if (upPressed) {
			this.jump();
		} else {
			this.jumpRelease();
		}


		if (rightPressed && !leftPressed) {
			this.moveRight();
			this.facingLeft = false;
		} else if (leftPressed && !rightPressed) {
			this.moveLeft();
			this.facingLeft = true;
		} else {
			this.moveSpeed = 0;
		}

		if (downPressed) {
			this.moveDown();
		}

	}


}