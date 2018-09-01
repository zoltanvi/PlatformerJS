class GameObject {
    constructor(x, y, width, height, isStatic) {
        
        this.x = x;
        this.y = y;

        
        this.left = x;              
        this.top = y;               
        this.right = x + width;     
        this.bottom = y + height;   

        
        this.width = width;
        this.height = height;

        
        this.isStatic = isStatic;
        this.color = "#ff5b45";

        this.vx = 0;
        this.vy = 0;

    }

    update() {
        this.calculateBounds();
        this.applyVelocity();
    }

    draw() {
        
        
        if(this.right >= cameraOffset){
            c.fillStyle = this.color;
            c.fillRect(this.x - cameraOffset, this.y, this.width, this.height);
        }
    }

    calculateBounds() {
        this.left = this.x;                   
        this.top = this.y;                    
        this.right = this.x + this.width;     
        this.bottom = this.y + this.height;   
    }


    applyVelocity() {
        if (!this.isStatic) {
            
            this.vy += GRAVITY * deltaTime;

            
            this.x += this.vx * deltaTime;
            this.y += this.vy * deltaTime;
        }

    }

    intersects(other){
        
        if (this.left > other.right || other.left > this.right){
            return false;
        }

        
        if (this.top < other.bottom || other.top < this.bottom){
            return false;
        }

        return true;
    }


}