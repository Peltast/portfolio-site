define("SpinAttack", ['Attack', 'Point', 'ParticleSystem'], function(Attack, Point, ParticleSystem) {
    
    class SpinAttack extends Attack {

        constructor(phases) {
            super(phases);

            this.inRecovery = false;
        }
        initAttack() {
            
            this.attackPhase = this.phases[0];
            this.spinHitbox = this.attackPhase.hitboxes[0];
        }
        
        beginAttack(hostActor, attackStrength) {
            super.beginAttack(hostActor);

            this.attackStrength = attackStrength;
            this.currentStrength = attackStrength;
        }
        endAttack(hostActor) {
            super.endAttack(hostActor);

            this.inRecovery = false;
            hostActor.sprite.gotoAndPlay("idle");
            gameStatsDisplay.updateRecoveryTimer(0, 1080 * 3 / 15);
        }

        unlockSuperSpin() {
            spinAttackSize = 180;
            this.spinHitbox.size.Y = spinAttackSize;
            this.spinHitbox.location.Y = 30;
            this.spinHitbox.drawCollisionDisplay();
        }

        updateAttack(hostActor) {
            if (!this.active)
                return;

            this.currentStrength -= 1;

            if (this.currentStrength <= 0) {
                this.inRecovery = true;
                this.progressAttack(hostActor);
                this.currentStrength = this.attackStrength * 3 / ( 1 + shardsRetrieved / 3 ) ;
            }

            if (this.inRecovery) {
                gameStatsDisplay.updateRecoveryTimer(this.currentStrength, 1080 * 3 / 15);
            }

            this.currentPhase.updatePhase(hostActor);

            return true;
        }

    }

    return SpinAttack;

});
