define("Shard", ['Actor', 'Point', 'Prop', 'ParticleSystem'], function(Actor, Point, Prop, ParticleSystem) {

    class Shard extends Actor {

        constructor(actorSize, spriteData, actorData) {
            super(actorSize, spriteData, actorData);
            
            this.activated = false;
            this.passable = true;
        }
        
        handleInteraction(player) {

        }


        updateOrientation() {
            return;
        }
        updateActor() {
            super.updateActor();
            
            if (this.activated) {
                
                var distToPlayer = new Point(this.location.X - player.lastFootstepLocation.X, this.location.Y - player.lastFootstepLocation.Y);

                if (distToPlayer.X < -12) {
                    this.setActorDirection("right", true);
                    this.setActorDirection("left", false);
                }
                else if (distToPlayer.X > 12) {
                    this.setActorDirection("left", true);
                    this.setActorDirection("right", false);
                }
                else {
                    this.setActorDirection("left", false);
                    this.setActorDirection("right", false);
                }

                if (distToPlayer.Y < -12) {
                    this.setActorDirection("down", true);
                    this.setActorDirection("up", false);
                }
                else if (distToPlayer.Y > 12) {
                    this.setActorDirection("up", true);
                    this.setActorDirection("down", false);
                }
                else {
                    this.setActorDirection("up", false);
                    this.setActorDirection("down", false);
                }

                
                var interactions = currentLevel.checkInteractionCollisions(this.location.X, this.location.Y, tileSize, tileSize, false);
                
                for (let i = 0; i < interactions.length; i++) {
                    if (interactions[i] instanceof Prop) {

                        if (interactions[i].type === "chalice") {
                            currentLevel.removeActor(this);
                            player.isHoldingShard = false;
                            shardsRetrieved += 1;

                            if (currentLevel.goalNumber ? shardsRetrieved >= currentLevel.goalNumber : false)
                                transition = true;

                            if (shardsRetrieved >= 9)
                                player.spinAttack.unlockSuperSpin();
                        }

                    }
                }
            }
        }
    }

    return Shard;

});