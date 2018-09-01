class Player extends GameObject {
    constructor(x, y, width, height, obstacles) {
        super(x, y, width, height, false);

        this.moveSpeed = 6;
        this.firstJumpForce = -12;
        this.secondJumpForce = -9;
        this.jumpDownForce = 2;
        this.grounded = true;
        this.facingLeft = false;
        this.isJumping = false;
        this.canJumpAgain = false;
        this.obstacles = obstacles;
        this.myGroundHeight = 0;
        this.images = [];
        for (let i = 0; i < 2; i++) {
            this.images.push(new Image());
        }
        this.images[0].src = "mario.png";
        this.images[1].src = "marioflipped.png";

        this.verticalRayCount = 3;
        this.horizontalRayCount = 4;
        this.ray;
        this.verticalRays = [];
        this.horizontalRays = [];
    }

    update() {
        this.handleKeys();
        this.calculateBounds();
        this.checkFacing();


        this.vy += GRAVITY * deltaTime;
        this.vy = parseFloat(this.vy.toPrecision(7));
        this.verticalCollision();
        this.move();

    }

    draw() {
        if (this.facingLeft) {
            c.drawImage(this.images[0], this.x, this.y, this.width, this.height);
        } else {
            c.drawImage(this.images[1], this.x, this.y, this.width, this.height);
        }



    }

    checkGrounded() {

        for (let i = 0; i < this.obstacles.length; i++) {

            if (this.stands(this.obstacles[i])) {

                this.grounded = true;
                this.isJumping = false;
                this.canJumpAgain = false;
                this.myGroundHeight = this.obstacles[i].top;
            }
        }

    }

    checkFacing() {
        if (leftPressed) {
            this.facingLeft = true;
        } else if (rightPressed) {
            this.facingLeft = false;
        }
    }

    applyVelocity() {

        if (!this.grounded) {
            this.vy += GRAVITY * deltaTime;
        } else {
            this.vy = 0;
        }


        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
    }

    verticalCollision() {
        let direction = Math.sign(this.vy * deltaTime);
        let rayLength = Math.abs(this.vy * deltaTime);

        if (direction > 0) {

  

            this.ray = new Raycast((this.left + this.width / 2), this.bottom, 2, rayLength, this.obstacles);
            if (this.ray.hit()) {
				this.y = this.ray.obstacleHitPos - this.height;
				this.grounded = true;
                this.vy = (this.ray.hitDistance) * direction;
                this.ray.setLength(this.ray.hitDistance);

            }

        } else if (direction < 0) {
            this.ray = new Raycast((this.left + this.width / 2), this.top, 1, rayLength, this.obstacles);
            if (this.ray.hit()) {
                this.y = this.ray.obstacleHitPos;
                this.vy = this.ray.hitDistance * direction;
                this.ray.setLength(this.ray.hitDistance);
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

    correctPosition() {
        if (this.grounded) {
            this.y = this.myGroundHeight - this.height;
        }
    }

    moveLeft() {
        this.x -= this.moveSpeed * deltaTime;
    }

    moveRight() {
        this.x += this.moveSpeed * deltaTime;
    }

    jump() {
        if(this.grounded){
            this.jumping = true;
            this.vy = this.firstJumpForce;
            this.move();
            this.grounded = false;
            console.log("JUMP");
        }
    }

    jumpRelease() {
        if(this.jumping){
            this.jumping = false;
            if(this.vy < 0){
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

        if (leftPressed) this.moveLeft();
        if (rightPressed) this.moveRight();

    }


}