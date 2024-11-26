define("Player", ['BaseObject', 'Point', 'Tile'], function(BaseObject, Point, Tile) {

    class Player extends BaseObject {

        constructor(size) {
            super(new Point(0, 0), size, false);
            
            this.maxRunSpeed = 6;
            this.acceleration = .01;
            this.deceleration = .06;
            this.trueDeceleration = this.deceleration;

            this.shortJumpHeight = 24;
            this.jumpHeight = 108;
            this.glideHeight = 330;
            this.timeToJumpApex = 35;

            this.gravity = (2 * this.jumpHeight) / Math.pow(this.timeToJumpApex, 2);
            this.shortJumpVelocity = Math.sqrt(2 * this.gravity * this.shortJumpHeight);
            this.jumpVelocity = this.gravity * this.timeToJumpApex;
            this.glideVelocity = Math.sqrt(2 * this.gravity * this.glideHeight);

            this.trueGravity = this.gravity;
            this.trueMaxGravity = this.gravity * 60;
            this.maxGravity = this.gravity * 60;
            this.aerialAcc = .01;
            this.aerialDec = .01;

            this.velocity = new Point(0, 0);
            this.targetVelocity = new Point(0, 0);
            
            this.spriteContainer = new createjs.Container();
            this.normalSprite = null;
            this.glideSprite = null;
            this.sprite = null;

            this.jumpHeld = false;
            this.maxJumps = 1;
            this.currentJumps = 1;

            this.goingLeft = false;
            this.goingRight = false;
            this.goingUp = false;
            this.onGround = false;

            this.glideDirection;
            this.priorGlideState;
            this.glideState;
            this.glideForwardVelocity = 0;
            this.isGliding = false;

            this.isFloating = false;

            this.direction = "right";
            this.priorDirection = this.direction;
            this.playerState = "stand";
            this.priorState = this.playerState;
            
            this.initiatePlayerSprite();
        }
        initiatePlayerSprite() {
            
            var glideSheet = new createjs.SpriteSheet({
                "images": [gameAssets["Glide"]],
                "frames": {"width": 56, "height": 50, "regX": 0, "regY": 0, "count": 8},
                    animations: {
                        rightglide: [0, 1, "rightglide", .2],
                        rightglideback: [2, 3, "rightglideback", .2],

                        leftglide: [4, 5, "leftglide", .2],
                        leftglideback: [6, 7, "leftglideback", .2],
                    }
            })
            this.glideSprite = new createjs.Sprite(glideSheet);

            var normalSheet = new createjs.SpriteSheet({
                "images": [gameAssets["Player"]],
                "frames": {"width": 32, "height": 64, "regX": 0, "regY": 0, "count": 32},
                    animations: {
                        rightstand: [0, 3, "rightstand", .15],
                        leftstand: [4, 7, "leftstand", .15],

                        rightwalk: [8, 11, "rightwalk", .05],
                        leftwalk: [12, 15, "leftwalk", .05],
                        rightwalkfast: [8, 11, "rightwalkfast", .15],
                        leftwalkfast: [12, 15, "leftwalkfast", .15],

                        rightrun: [16, 19, "rightrun", .1],
                        leftrun: [20, 23, "leftrun", .1],
                        rightrunfast: [16, 19, "rightrunfast", .22],
                        leftrunfast: [20, 23, "leftrunfast", .22],
                        rightrunfastest: [16, 19, "rightrunfastest", .3],
                        leftrunfastest: [20, 23, "leftrunfastest", .3],
                        
                        rightjump: 24,
                        leftjump: 25,

                        rightfall: 26,
                        leftfall: 27,

                        rightfloat: [28, 29, "rightfloat", .1],
                        leftfloat: [30, 31, "leftfloat", .1]
                    }
            });
            this.normalSprite = new createjs.Sprite(normalSheet);

            this.sprite = this.normalSprite;
            this.spriteContainer.addChild(this.sprite);
            this.sprite.gotoAndPlay(this.direction + this.playerState);
            
            this.spriteContainer.x = location.X;
            this.spriteContainer.y = location.Y;
        }

        setPlayerDirection(direction, isMoving) {
            switch (direction) {
                case "left":
                    this.goingLeft = isMoving;
                    break;
                case "right":
                    this.goingRight = isMoving;
                    break;
            }

            if (this.isGliding) {
                this.setGlideEffect(direction === this.direction, isMoving);
            }
            else {
                this.direction = direction;
            }
        }
        setGlideEffect(sameDirection, keyPress) {
            if (sameDirection) {
                this.gravity = this.trueGravity;
                this.maxGravity = this.trueMaxGravity / 2;
                this.velocity.X = this.glideForwardVelocity;
                this.glideState = "";
            }
            else {
                this.gravity = this.trueGravity / 4;
                this.maxGravity = this.trueMaxGravity / 4;
                this.velocity.X = this.velocity.X * .5;
                this.glideState = "back";
            }
        }

        setPlayerJump() {
            if (this.currentJumps <= 0 || this.jumpHeld)
                return;
            
            if (this.playerState == "runfastest" && !this.isFloating) {
                this.setPlayerGlide();
            }
            else {
                this.velocity.Y = -this.jumpVelocity;
            }

            if (!this.isFloating)
                this.currentJumps -= 1;
            
            this.playerState = "jump";
            this.onGround = false;
            this.goingUp = true;

            this.jumpHeld = true;
        }
        releasePlayerJump() {
            this.goingUp = false;
            this.jumpHeld = false;

            if (this.isFloating)
                this.playerState = "float";
        }
        setPlayerGrounded() {
            this.velocity.Y = this.gravity;
            
            this.onGround = true;
            this.currentJumps = this.maxJumps;
            this.playerState = "stand";

            if (this.isGliding) {
                this.setPlayerGlideStop();
            }
        }
        setPlayerUnGrounded() {
            this.onGround = false;
            if (this.currentJumps > 0 && !this.isGliding)
                this.currentJumps -= 1;
            if (this.velocity.Y < 0)
                this.playerState = "jump";
            else if (this.isFloating)
                this.playerState = "float";
            else
                this.playerState = "fall";
        }

        setPlayerGlide() {
            this.velocity.Y = -this.glideVelocity;
            this.isGliding = true;
            this.glideForwardVelocity = this.velocity.X;
            this.glideDirection = this.direction;
            this.currentJumps += 1;

            this.spriteContainer.removeChild(this.sprite);
            this.spriteContainer.addChild(this.glideSprite);
            
            this.glideSprite.gotoAndPlay(this.glideDirection + "glide");

            this.setGlideEffect(true);
        }
        setPlayerGlideStop() {

            this.isGliding = false;
            this.maxGravity = this.trueMaxGravity;
            this.gravity = this.trueGravity;

            this.spriteContainer.removeChild(this.glideSprite);
            this.spriteContainer.addChild(this.sprite);
        }
        
        setPlayerFloat () {
            this.isFloating = true;
            this.currentJumps = 1;
            this.gravity = this.trueGravity / 10;
            this.maxGravity = this.trueMaxGravity;
            this.deceleration = this.trueDeceleration / 3;
        }
        setPlayerFloatStop() {
            this.isFloating = false;
            this.gravity = this.trueGravity;
            this.maxGravity = this.trueMaxGravity;
            this.deceleration = this.trueDeceleration;
        }
        
        updatePlayer() {
            this.updateDirection();
            this.updateSpeed();
            this.updatePosition(true);
            this.updatePosition(false);
            this.updateState();
        }
        
        updateDirection() {

            if (this.goingLeft) {
                this.targetVelocity.X = -this.maxRunSpeed;
                this.direction = "left";
            }
            else if (this.goingRight) {
                this.targetVelocity.X = this.maxRunSpeed;
                this.direction = "right";
            }
            else {
                this.targetVelocity.X = 0;
            }
            if (this.isGliding)
                this.direction = this.glideDirection;
        }
        updateSpeed() {
            var xAcceleration;
            if (this.onGround)
                xAcceleration = (this.goingLeft || this.goingRight) ? this.acceleration : this.deceleration;
            else
                xAcceleration = (this.goingLeft || this.goingRight) ? this.aerialAcc : this.aerialAcc;

            this.velocity.X = this.targetVelocity.X * xAcceleration + (1 - xAcceleration) * this.velocity.X;
            if (this.velocity.X > this.maxRunSpeed)
                this.velocity.X = this.maxRunSpeed;
            else if (this.velocity.X < -this.maxRunSpeed)
                this.velocity.X = -this.maxRunSpeed;

            if (!this.onGround) {
                
                this.velocity.Y += this.gravity;
                if (this.velocity.Y > this.maxGravity)
                    this.velocity.Y = this.maxGravity;
                    
                if (!this.goingUp && this.velocity.Y < -this.shortJumpVelocity)
                    this.velocity.Y = -this.shortJumpVelocity;
            }
            this.velocity.X = Math.round(this.velocity.X * 1000) / 1000;
            this.velocity.Y = Math.round(this.velocity.Y * 1000) / 1000;

            if (Math.abs(this.velocity.X) <= .01) {
                this.velocity.X = 0;
            }
            else if (this.targetVelocity.X == 0 && !this.goingLeft && !this.goingRight && Math.abs(this.velocity.X) <= 0.025) {
                this.velocity.X = 0;
            }
        }
        updatePosition(xAxis) {
            if (xAxis)
                this.location.X += this.velocity.X;
            else
                this.location.Y += this.velocity.Y;

            this.handleCollisions();
            var collisions = currentLevel.checkObjectCollisions(this);
            if (collisions.length > 0)
                this.updatePositionOnCollision(collisions, xAxis);
            else if (!xAxis && this.onGround)
                this.setPlayerUnGrounded();
            
            if (xAxis)
                this.spriteContainer.x = Math.round(this.location.X);
            else
                this.spriteContainer.y = Math.round(this.location.Y);
        }
        handleCollisions() {
            
        }
        
        updatePositionOnCollision(collisions, xAxis) {
            var collisionDistances = [];
            for (let i = 0; i < collisions.length; i++) {

                if (collisions[i] instanceof Tile && collisions[i].passthrough) {
                    
                    if (xAxis || (!xAxis && this.velocity.Y < 0))
                        continue;
                    else {
                        var tempCollisionDistance = collisions[i].getCollisionDistance(this, xAxis);
                        if (Math.abs(tempCollisionDistance) > this.maxGravity || tempCollisionDistance > 0) {
                            continue;
                        }
                    }
                }
                var tempCollisionDistance = tempCollisionDistance ? tempCollisionDistance : collisions[i].getCollisionDistance(this, xAxis);
                collisionDistances.push(tempCollisionDistance);
            }
            var collisionDistance = this.getFarthestCollisions(collisionDistances);

            if (xAxis && collisionDistances.length > 0) {
                this.location.X += collisionDistance;
                this.targetVelocity.X = 0;
                this.velocity.X = 0;
            }
            else if (collisionDistances.length > 0) {
                if (collisionDistance < 0 && !this.onGround)
                    this.setPlayerGrounded();
                this.location.Y += collisionDistance;
            }
        }
        getFarthestCollisions(distances) {
            var maxDistance = 0;
            for (let i = 0; i < distances.length; i++) {
                if (Math.abs(distances[i]) > maxDistance)
                    maxDistance = distances[i];
            }
            return maxDistance;
        }

        updateState() {
            
            if (this.isGliding && this.priorGlideState !== this.glideState) {
                this.glideSprite.gotoAndPlay(this.glideDirection + "glide" + this.glideState);
                this.priorGlideState = this.glideState;
            }
            else if (this.direction !== this.priorDirection || this.playerState !== this.priorState) {
                
                this.sprite.gotoAndPlay(this.direction + this.playerState);
                this.priorDirection = this.direction;
                this.priorState = this.playerState;
            }

            if (this.onGround) {

                if (this.velocity.X == 0)
                    this.playerState = "stand";                
                
                else if (Math.abs(this.velocity.X) >= this.maxRunSpeed * .9)
                    this.playerState = "runfastest";
                else if (Math.abs(this.velocity.X) >= this.maxRunSpeed * .75)
                    this.playerState = "runfast";
                else if (Math.abs(this.velocity.X) >= this.maxRunSpeed * .65)
                    this.playerState = "run";
                else if (Math.abs(this.velocity.X) >= this.maxRunSpeed * .35)
                    this.playerState = "walkfast";
                else
                    this.playerState = "walk";
            }
            else {
                if (this.isFloating && this.velocity.Y >= this.maxGravity * .2)
                    this.playerState = "float";
                else if (this.velocity.Y > 0)
                    this.playerState = "fall";
            }
        }

    }

    return Player;
});