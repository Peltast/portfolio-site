define("BaseObject", ['Point'], function(Point) {

    class BaseObject {
        constructor(location, size, passable) {
            this.location = location;
            this.size = size;
            this.passable = passable;
        }

        checkCollision(otherObject, checkPassable) {
            if (otherObject === this)
                return false;
            else if (this.passable && checkPassable)
                return false;
            else if (
                otherObject.location.X < this.location.X + this.size.X &&
                otherObject.location.X + otherObject.size.X > this.location.X &&
                otherObject.location.Y < this.location.Y + this.size.Y &&
                otherObject.location.Y + otherObject.size.Y > this.location.Y
            )
                return true;
            else
                return false;
        }
        checkCollisionWithRect(x, y, width, height, checkPassable) {
            if (this.passable && checkPassable)
                return false;
            else if (
                x < this.location.X + this.size.X &&
                x + width > this.location.X &&
                y < this.location.Y + this.size.Y &&
                y + height > this.location.Y
            )
                return true;
            else
                return false;
        }

        getCollisionDistance(otherObject, xAxis) {

            var objectCenter = new Point(this.location.X + this.size.X / 2, this.location.Y + this.size.Y / 2);
            var otherCenter = new Point(otherObject.location.X + otherObject.size.X / 2, otherObject.location.Y + otherObject.size.Y / 2);

            if (xAxis) {
                if (objectCenter.X - otherCenter.X >= 0)        // distance from left edge
                    return this.location.X - (otherObject.location.X + otherObject.size.X);
                else if (objectCenter.X - otherCenter.X < 0)    // distance from right edge
                    return (this.location.X + this.size.X) - otherObject.location.X;
            }
            else {
                if (objectCenter.Y - otherCenter.Y >= 0)        // distance from top edge
                    return this.location.Y - (otherObject.location.Y + otherObject.size.Y);
                else if (objectCenter.Y - otherCenter.Y < 0)    // distance from bottom edge
                    return (this.location.Y + this.size.Y) - otherObject.location.Y;
            }
        }

    }

    return BaseObject;
});