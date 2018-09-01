class Player extends GameObject {
    constructor(x, y, width, height, obstacles) {
        super(x, y, width, height, false);

        this.moveSpeed = 6;
        this.mSpeed = 6;
        this.firstJumpForce = -12;
        this.secondJumpForce = -9;
        this.jumpDownForce = 2;
        this.grounded = true;
        this.facingLeft = false;
        this.isJumping = false;
        this.canJumpAgain = false;
        this.obstacles = obstacles;
        this.images = [];
        for (let i = 0; i < 2; i++) {
            this.images.push(new Image());
        }
        this.images[0].src = "mario.png";
        this.images[1].src = "marioflipped.png";

        this.verticalRayCount = 3;
        this.horizontalRayCount = 10;
        this.verticalRaySpacing = this.width / (this.verticalRayCount - 1);
        this.horizontalRaySpacing = (this.height - 2) / (this.horizontalRayCount - 1);
        this.verticalRays = [];
        this.horizontalRays = [];
        this.horizontalRays2 = [];
        this.canGoLeft = true;
        this.canGoRight = true;

    }

    update() {
        this.handleKeys();
        this.calculateBounds();

        this.vy += GRAVITY * deltaTime;
        this.verticalCollision();
        this.horizontalCollision();
        this.move();

        cameraOffset = this.x - (gamePanel.width / 2) + (this.width / 2);

        
    }

    draw() {
        if (this.facingLeft) {
            c.drawImage(this.images[0], (gamePanel.width / 2) - (this.width / 2), this.y, this.width, this.height);
        } else {
            c.drawImage(this.images[1], (gamePanel.width / 2) - (this.width / 2), this.y, this.width, this.height);
        }

        
        
        
        
        
        
        
        
        
        
        
        
        
    }

    verticalCollision() {
        let direction = Math.sign(this.vy * deltaTime);
        let rayLength = Math.abs(this.vy * deltaTime);

        
        if (direction > 0) {

            for (let i = 0; i < this.verticalRayCount; i++) {
                this.verticalRays[i] = new Raycast(this.left + i * this.verticalRaySpacing, this.bottom, 2, rayLength, this.obstacles);
                if (this.verticalRays[i].hit()) {
                    this.y = this.verticalRays[i].obstacleHitPos - this.height;
                    this.grounded = true;
                    this.vy = this.verticalRays[i].hitDistance * direction;
                    this.verticalRays[i].setLength(this.verticalRays[i].hitDistance);

                }
            }

            
        } else if (direction < 0) {

            for (let i = 0; i < this.verticalRayCount; i++) {
                this.verticalRays[i] = new Raycast(this.left + i * this.verticalRaySpacing, this.top, 1, rayLength, this.obstacles);
                if (this.verticalRays[i].hit()) {
                    this.y = this.verticalRays[i].obstacleHitPos;
                    this.vy = this.verticalRays[i].hitDistance * direction;
                    this.verticalRays[i].setLength(this.verticalRays[i].hitDistance);

                }
            }

        }

    }

    horizontalCollision() {
        
        let rayLength = (this.width / 2);

        
        for (let i = 0; i < this.horizontalRayCount; i++) {
            this.horizontalRays[i] = new Raycast(this.left + (this.width / 2), (this.top + 1) + i * this.horizontalRaySpacing, 3, rayLength, this.obstacles);
            if (this.horizontalRays[i].hit()) {
                if (this.x <= this.horizontalRays[i].obstacleHitPos) {
                    if (this.x < this.horizontalRays[i].obstacleHitPos) {
                        this.x = this.horizontalRays[i].obstacleHitPos + 1;
                    }
                    this.canGoLeft = false;
                }
            } else {
                this.canGoLeft = true;
            }
        }
        
        for (let i = 0; i < this.horizontalRayCount; i++) {
            this.horizontalRays2[i] = new Raycast(this.right - (this.width / 2), (this.top + 1) + i * this.horizontalRaySpacing, 4, rayLength, this.obstacles);
            if (this.horizontalRays2[i].hit()) {
                if (this.right >= this.horizontalRays2[i].obstacleHitPos) {
                    if (this.right > this.horizontalRays2[i].obstacleHitPos) {
                        this.x = this.horizontalRays2[i].obstacleHitPos - this.width - 1;
                    }
                    this.canGoRight = false;
                }
            } else {
                this.canGoRight = true;
            }
        }
       

    }

    /**
     * Moves the player according to it's velocity
     */
    move() {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
    }

    moveLeft() {
        if (this.canGoLeft) this.x -= this.moveSpeed * deltaTime;
    }

    moveRight() {
        if (this.canGoRight) this.x += this.moveSpeed * deltaTime;
    }


    jump() {
        if (this.grounded) {
            this.jumping = true;
            this.vy = this.firstJumpForce;
            this.move();
            this.grounded = false;
           
        }
    }

    jumpRelease() {
        if (this.jumping) {
            this.jumping = false;
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

        if (leftPressed) {
            this.moveLeft();
            this.facingLeft = true;
        }

        if (rightPressed) {
            this.moveRight();
            this.facingLeft = false;
        }

    }


}