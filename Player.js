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

        this.ray;
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

        c.fillStyle = "#00f7ff";
        c.fillRect(this.x, this.y, this.width, this.height);
        this.ray.draw();
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
        let direction = Math.sign(this.vy);
        let rayLength = Math.abs(this.vy) + 0.2;


        if (direction > 0) {

            this.ray = new Raycast((this.left + this.width / 2), this.bottom, 2, rayLength, this.obstacles);
            if (this.ray.hit()) {
                console.log("standing on something");
                this.grounded = true;
                this.vy = (this.ray.hitDistance) * direction;
                this.ray.setLength(this.ray.hitDistance);
            } else {
                console.log("FALLING");
            }

        } else if (direction < 0) {
            this.ray = new Raycast((this.left + this.width / 2), this.top, 1, rayLength, this.obstacles);
            if (this.ray.hit()) {
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
            this.vy = this.firstJumpForce;
            this.move();
            this.grounded = false;
            console.log("JUMP");
        }

    }

    jumpRelease() { }

    handleKeys() {
        if (upPressed) {
            this.jump();
        } else {
            this.jumpRelease();
        }

        if (leftPressed) this.moveLeft();
        if (rightPressed) this.moveRight();

    }


    collides(other, direction) {


        if (direction > 0) {



        } else if (direction < 0) {

        }


        if (this.bottom <= other.top) {


            if ((this.bottom + this.vy * deltaTime) > other.top) {


                if (

                    (this.left <= other.left) && (this.right > other.left) ||

                    (this.left >= other.left) && (this.right <= other.right) ||

                    (this.left < other.right) && (this.right >= other.right)
                ) {

                    return true;
                }
            }
        }

        return false;
    }


}