define("CollisionBox", ['Point'], function(Point) {
    
    class CollisionBox {

        constructor(hitBox = true, x = 0, y = 0, width = 0, height = 0, advancedCollision = false, visible = false) {
            this.type = hitBox ? "hitBox" : "hurtBox";
            this.location = new Point(x, y);
            this.size = new Point(width, height);
            this.advancedCollision = advancedCollision;
            this.alwaysVisible = visible;

            this.collisionDisplay = new createjs.Shape();
            this.collisionDisplay.graphics.beginFill(this.type == "hitBox" ? "#dd0000" : "#333333").drawRect(x, y, width, height);
            this.collisionDisplay.alpha = this.alwaysVisible ? 0.7 : 0;
            this.collisionDisplay.setBounds(x, y, width, height);
            this.isVisible = false;
            this.parentObject = null;
        }

        get() {
            return new CollisionBox(this.location.X, this.location.Y, this.size.X, this.size.Y);
        }

        getX() {
            return this.location.X + this.parentObject.location.X;
        }
        getY() {
            return this.location.Y + this.parentObject.location.Y;
        }

        intersects(otherBox) {
            if (!(otherBox instanceof CollisionBox)) {
                console.log("Collision tried to intersect with non-collision object " + otherBox);
                return;
            }

            if (otherBox.advancedCollision) {
                var globalBounds = this.getGlobalBounds(otherBox.collisionDisplay);
                if (
                    globalBounds.x < this.getX() + this.size.X && 
                    globalBounds.x + globalBounds.width > this.getX() &&
    
                    globalBounds.y < this.getY() + this.size.Y && 
                    globalBounds.y + globalBounds.height > this.getY()
                ) {
                    return true;
                }
                else
                    return false;
            }

            if (
                otherBox.getX() < this.getX() + this.size.X && 
                otherBox.getX() + otherBox.size.X > this.getX() &&

                otherBox.getY() < this.getY() + this.size.Y && 
                otherBox.getY() + otherBox.size.Y > this.getY()
            ) {
                return true;
            }
            else
                return false;
        }
        getGlobalBounds(child) {
            var bounds = child.getBounds();
            var tl = child.localToGlobal(bounds.x, bounds.y);
            var tr = child.localToGlobal(bounds.x + bounds.width, bounds.y);
            var br = child.localToGlobal(bounds.x + bounds.width, bounds.y + bounds.height);
            var bl = child.localToGlobal(bounds.x, bounds.y + bounds.height);
          
            var minX = Math.min(tl.x, tr.x, br.x, bl.x);
            var maxX = Math.max(tl.x, tr.x, br.x, bl.x);
            var minY = Math.min(tl.y, tr.y, br.y, bl.y);
            var maxY = Math.max(tl.y, tr.y, br.y, bl.y);
          
            return new createjs.Rectangle(minX - currentLevel.screenPosition.X, minY - currentLevel.screenPosition.Y, maxX-minX, maxY-minY);
        }
        
        getCollisionDistance(otherBox, xAxis) {

            var boxCenter = new Point(this.getX() + this.size.X / 2, this.getY() + this.size.Y / 2);
            var otherCenter = new Point(otherBox.getX() + otherBox.size.X / 2, otherBox.getY() + otherBox.size.Y / 2);
            
            if (xAxis) {
                if (boxCenter.X - otherCenter.X >= 0)		// distance from left edge
                    return this.getX() - (otherBox.getX() + otherBox.size.X); 
                else if (boxCenter.X - otherCenter.X < 0)	// distance from right edge
                    return (this.getX() + this.size.X) - otherBox.getX();
            }
            else {
                if (boxCenter.Y - otherCenter.Y >= 0)		// distance from top edge
                    return this.getY() - (otherBox.getY() + otherBox.size.Y); 
                else if (boxCenter.Y - otherCenter.Y < 0)	// distance from bottom edge
                    return (this.getY() + this.size.Y) - otherBox.getY();
            }
        }
        
        getCollisionVector(otherBox) {
            
            var objectCenter = new Point(this.getX() + this.size.X / 2, this.getY() + this.size.Y / 2);
            var otherCenter = new Point(otherBox.getX() + otherBox.size.X / 2, otherBox.getY() + otherBox.size.Y / 2);

            return new Point(objectCenter.X - otherCenter.X, objectCenter.Y - otherCenter.Y);
        }

        toggleDisplay() {
            if (this.alwaysVisible)
                return;
            this.collisionDisplay.alpha = this.collisionDisplay.alpha > 0 ? 0 : 0.5;
            this.isVisible = !this.isVisible;
        }
        setVisible(v) {
            if (this.alwaysVisible)
                return;
            this.drawCollisionDisplay();
            this.collisionDisplay.alpha = v ? 0.5 : 0;
            this.isVisible = v;
        }
        drawCollisionDisplay() {
            this.collisionDisplay = new createjs.Shape();
            this.collisionDisplay.graphics.beginFill(this.type == "hitBox" ? "#dd0000" : "#333333").drawRect(this.location.X, this.location.Y, this.size.X, this.size.Y);
            this.collisionDisplay.setBounds(this.location.X, this.location.Y, this.size.X, this.size.Y);
        }

    }

    return CollisionBox;

});
