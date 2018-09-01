class Raycast{
    /**
     * Directions:
     * 1: up
     * 2: down
     * 3: left
     * 4: right
     * You can get the hit distance from the ray origin after you check it with the hit() method!
     */
    constructor(x, y, direction, length, obstacles){
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.length = length;
        this.obstacles = obstacles;
        this.hitDistance = 0;
    }

    setPosition(x, y){
        this.x = x;
        this.y = y;
    }

    setLength(length){
        this.length = length;
    }

    /**
     * Sets the rays direction
     * 1: up
     * 2: down
     * 3: left
     * 4: right
     */
    setDirection(direction){
        this.direction = direction;
    }

    /**
     * Returns true, if it hits any obstacle, else returns false.
     */
    hit(){
        let collision = false;
        this.hitDistance = 0;
        for (let i = 0; i < this.obstacles.length; i++) {
            let obstacle = this.obstacles[i];

            if(obstacle.left <= this.x && obstacle.right >= this.x){

                switch (this.direction) {

                    case 1:

                        if((obstacle.bottom >= this.y - this.length) && (obstacle.bottom <= this.y)){

                            if(this.hitDistance > this.y - obstacle.bottom){
                                this.hitDistance = this.y - obstacle.bottom;
                            }
                            collision = true;
                        }
                        break;


                    case 2:

                        if((obstacle.top <= this.y + this.length) && (obstacle.top >= this.y)){

                            if(this.hitDistance > obstacle.top - this.y){
                                this.hitDistance = obstacle.top - this.y;
                            }
                            collision = true;
                        }
                        break;


                    case 3:

                        if((obstacle.right >= this.x - this.length) && (obstacle.right <= this.x)){

                            if(this.hitDistance > this.x - obstacle.right){
                                this.hitDistance = this.x - obstacle.right;
                            }
                            collision = true;
                        }
                        break;


                    case 4:

                        if((obstacle.left <= this.x + this.length) && (obstacle.left >= this.x)){

                            if(this.hitDistance > obstacle.left - this.x){
                                this.hitDistance = obstacle.left - this.x;
                            }
                            collision = true;
                        }
                        break;
                }
            }
        }

        return collision;
    }


    draw(){
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineWidth = 2;
        c.strokeStyle = "#ff0001";

        switch (this.direction) {

            case 1: c.lineTo(this.x, this.y - this.length); break;

            case 2: c.lineTo(this.x, this.y + this.length);  break;

            case 3: c.lineTo(this.x - this.length, this.y);  break;

            case 4: c.lineTo(this.x + this.length, this.y);  break;
        }
        c.closePath();
        c.stroke();
    }

}