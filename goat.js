class Goat
  {
    constructor(x, y, size){
      this.x = x;
      this.y = y;
      this.size = size;
      this.isMoving = true;
      this.isHidden = true;
    }
    
  display() {
    if (!this.isHidden) {
      textAlign(CENTER, CENTER);
      textSize(this.size);
      text("🐐", this.x, this.y);
    }
  }
    
  update() {
    if (this.isMoving) {
      this.x += random(-20, 20);
      this.y += random(-20, 20);
      this.checkEdges();
    }
  }

  checkEdges() {
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  isTouched(wrist) {
    let d = dist(wrist.x, wrist.y, this.x, this.y);
    return d < 30; 
  }

  reveal(size) {
    this.isHidden = false;
    this.isMoving = false;
    this.size = size;
  }
}