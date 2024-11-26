define("EnemyBehavior", ['Point'], function(Point) {
    
    const Behavior = { "Stationary" : "Stationary", "Pacing": "Pacing", "Chase": "Chase"};
    const DeathState = { "Alive" : 0, "Dying": 1, "Dead": 2};

    class EnemyBehavior {

        constructor(hostEnemy, behaviorType) {
            
            this.hostEnemy = hostEnemy;
            this.type = Behavior[behaviorType];
        }

        updateBehavior() {
            // var distToPlayer = new Point(this.hostEnemy.location.X - player.location.X, this.hostEnemy.location.Y - player.location.Y);

            if (this.hostEnemy.deathStatus === DeathState.Dying)
                return;

            this.hostEnemy.targetVelocity = new Point(player.location.X - this.hostEnemy.location.X, player.location.Y - this.hostEnemy.location.Y);
            
            var distToPlayer = new Point(this.hostEnemy.location.X - player.location.X, this.hostEnemy.location.Y - player.location.Y);

            if (distToPlayer.X < 0) {
                this.hostEnemy.setActorDirection("right", true);
                this.hostEnemy.setActorDirection("left", false);
            }
            else {
                this.hostEnemy.setActorDirection("left", true);
                this.hostEnemy.setActorDirection("right", false);
            }

            if (distToPlayer.Y < 0) {
                this.hostEnemy.setActorDirection("down", true);
                this.hostEnemy.setActorDirection("up", false);
            }
            else {
                this.hostEnemy.setActorDirection("up", true);
                this.hostEnemy.setActorDirection("down", false);
            }
        }
        
        updatePositionOnCollision(collisions, xAxis) {
            
        }
        handleCollisions() {
            
        }
        handleCollidedBy(actor) {
            
        }
    }

    return EnemyBehavior;

});
