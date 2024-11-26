define("ActorController", ['Point'], function(Point) {
    
    class ActorController {
        
        constructor(motionData) {

            this.acceleration = motionData["acceleration"];
            this.deceleration = motionData["deceleration"];
            this.spinAcc = motionData["spinAcc"] || 0;
            this.spinDec = motionData["spinDec"] || 0;
            this.aerialAcc = motionData["aerialAcc"];
            this.aerialDec = motionData["aerialDec"];
            this.maxSpeed = motionData["maxSpeed"];
            this.maxSpin = motionData["maxSpin"] || 0;
            
            this.isFlying = motionData["isFlying"] ? motionData["isFlying"] : false;
            this.jumpHeight = motionData["jumpHeight"];
            this.shortJumpHeight = motionData["shortJumpHeight"];
            this.timeToJumpApex = motionData["timeToJumpApex"];
            this.gCoefficient = motionData["gCoefficient"] != undefined ? motionData["gCoefficient"] : 60;
            
            this.maxJumps = motionData["maxJumps"];
            this.currentJumps = this.maxJumps;
            
            this.gravity = (2 * this.jumpHeight) / Math.pow(this.timeToJumpApex, 2);
            this.shortJumpVelocity = Math.sqrt(2 * this.gravity * this.shortJumpHeight);
            this.jumpVelocity = this.gravity * this.timeToJumpApex;
            this.maxGravity = this.gravity * this.gCoefficient;
            
            this.originStaticVelX = motionData["staticVelocityX"];
            this.originStaticVelY = motionData["staticVelocityY"];
            this.staticSpin = motionData["staticSpin"];
            this.staticVelocityX = this.originStaticVelX;
            this.staticVelocityY = this.originStaticVelY;
            
            var forceX = motionData["forceX"] ? motionData["forceX"] : 0;
            var forceY = motionData["forceY"] ? motionData["forceY"] : 0;
            this.originalForce = new Point(forceX, forceY);
            this.force = this.originalForce.get();

            this.resetVelocity = motionData["resetVelocity"] != null ? motionData["resetVelocity"] : false;
            this.resetVerticalVel = motionData["resetVerticalVel"] != null ? motionData["resetVerticalVel"] : false;
            this.acceptInput = motionData["acceptInput"] != null ? motionData["acceptInput"] : true;
            this.inheritJumps = motionData["inheritJumps"] != null ? motionData["inheritJumps"] : true;
            this.setAnimation = motionData["setAnimation"];
        }

        reset() {
            this.currentJumps = this.maxJumps;
        }

        init(actor) {
            
            if (this.resetVelocity) {
                actor.velocity = new Point(0, 0);
                actor.spinVel = 0;
            }
            else if (this.resetVerticalVel)
                actor.velocity.Y = 0;
            
            actor.velocity.add(this.force);

            if (this.inheritJumps && actor.currentController) {
                if (actor.onGround)
                    this.currentJumps = this.maxJumps;
                else
                    this.currentJumps = Math.min(this.maxJumps, actor.currentController.currentJumps);
            }
        }

        updateSpeed(actor) {
            
            if (this.staticVelocityX)
                actor.velocity.X = this.staticVelocityX;
            else
                this.updateHorizontalSpeed(actor);
            
            if (this.staticVelocityY)
                actor.velocity.Y = this.staticVelocityY;
            else
                this.updateVerticalSpeed(actor);

            if (this.staticSpin)
                actor.spinVel = this.staticSpin;
            else
                this.updateRotationSpeed(actor);

            actor.velocity.X = Math.round(actor.velocity.X * 100) / 100;
            actor.velocity.Y = Math.round(actor.velocity.Y * 100) / 100;

            if (Math.abs(actor.velocity.X) <= .01) {
                actor.velocity.X = 0;
            }
            else if (actor.targetVelocity.X == 0 && !actor.goingLeft && !actor.goingRight && Math.abs(actor.velocity.X) <= 0.5) {
                actor.velocity.X = 0;
            }
        }
        updateHorizontalSpeed(actor) {
            var xAcceleration;

            xAcceleration = (actor.goingLeft || actor.goingRight) ? this.acceleration : this.deceleration;
            
            actor.velocity.X = this.applyAcceleration(xAcceleration, actor.velocity.X, actor.targetVelocity.X, this.maxSpeed);
        }
        updateVerticalSpeed(actor) {
            var yAcceleration;

            yAcceleration = (actor.goingUp || actor.goingDown) ? this.acceleration : this.deceleration;
            
            actor.velocity.Y = this.applyAcceleration(yAcceleration, actor.velocity.Y, actor.targetVelocity.Y, this.maxSpeed);
        }
        updateRotationSpeed(actor) {
            var spinAcceleration = this.isActorRotating(actor) ? this.spinAcc : this.spinDec;
            actor.spinVel = this.applyAcceleration(spinAcceleration, actor.spinVel, actor.targetSpinVel, this.maxSpin);
        }

        applyAcceleration(acc, speed, targetSpeed, max) {
            var newSpeed = targetSpeed * acc + (1 - acc) * speed;
            newSpeed = Math.min(newSpeed, max);
            newSpeed = Math.max(newSpeed, -max);

            return newSpeed;
        }

        flipDirectionalProperties(direction) {
            if (this.originStaticVelX)
                this.staticVelocityX = (direction === "left") ? -this.originStaticVelX : this.originStaticVelX;
            if (this.originalForce)
                this.force.X = (direction === "left") ? -this.originalForce.X : this.originalForce.X;
        }

        isActorMoving(actor) {
            return (actor.goingLeft || actor.goingRight || actor.goingUp || actor.goingDown);
        }
        isActorRotating(actor) {
            return (actor.rotatingLeft || actor.rotatingRight);
        }

    }

    return ActorController;

});