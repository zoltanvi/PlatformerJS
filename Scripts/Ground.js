class Ground extends GameObject {
	constructor(x, y, width, height, color) {
		super(x, y, width, height, true);
		this.color = color || "#00b6ff";
		this.image = new Image();
		this.image.src = "sprites/brickTile.png";
	}

	drawOverride() {
		c.drawImage(this.image, this.x, this.y, this.width, this.height);
	}

}