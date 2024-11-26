define("Enemy", 
    ['Point', 'Actor', 'EnemyBehavior', 'ActorController', 'ParticleSystem'], 
    function(Point, Actor, EnemyBehavior, ActorController, ParticleSystem) {

    const DeathState = { "Alive" : 0, "Dying": 1, "Dead": 2};

    class Enemy extends Actor {
        
        constructor(actorSize, spriteData, enemyData, aiBehavior) {
            super(actorSize, spriteData, enemyData);
            this.isNPC = true;

            if (enemyData["behavior"])
                this.aiBehavior = new EnemyBehavior(this, enemyData["behavior"]);
            
            this.damageOnTouch = enemyData["damageOnTouch"] ? enemyData["damageOnTouch"] : true;
            this.deathAnimation = enemyData["deathAnimation"] ? enemyData["deathAnimation"] : "";
            this.deathTimer = enemyData["deathTimer"] ? enemyData["deathTimer"] : 0;
            this.deathStatus = DeathState.Alive;
            this.deathController = new ActorController(controllerData["gravityFree"]);

            this.deathCombo;
            this.deathScore;
            
            this.initEnemy();
        }
        initEnemy() {
            
            if (this.damageOnTouch)
                this.addHitbox(null, -18, -18, 30, 30);
            this.addHurtbox(null, -18, -18, 30, 30);
        }
        
        updateActor() {

            if (this.aiBehavior)
                this.aiBehavior.updateBehavior();
            if (this.deathStatus !== DeathState.Alive)
                this.updateDeath();

            super.updateActor();
        }
        
        addParticleEffect(effectName) {
            var particleSystem = new ParticleSystem(effectName);
            particleSystem.effectAreaOrigin.add(this.location);
            currentLevel.foregroundLayer.addChild(particleSystem.systemContainer);

            this.particleEffects.push(particleSystem);
        }

        updatePositionOnCollision(collisions, xAxis) {
            super.updatePositionOnCollision(collisions, xAxis);
            if (this.aiBehavior)
                this.aiBehavior.updatePositionOnCollision(collisions, xAxis);
        }
        
        handleCollisions() {
            if (this.aiBehavior)
                this.aiBehavior.handleCollisions();
        }
        handleCollidedBy(actor) {
            if (this.aiBehavior)
                this.aiBehavior.handleCollisions(actor);
        }

        takeDamage(collisions) {
            if (collisions.length > 0) {
                var nonEnemyDamage = false;
                for (let i = 0; i < collisions.length; i++) {
                    if (!(collisions[i].parentObject instanceof Enemy)) {
                        nonEnemyDamage = true;
                        break;
                    }
                }
                if (!nonEnemyDamage)
                    return;
            }

            if (this.deathStatus === DeathState.Alive) { 
                this.state = this.deathAnimation;
                this.deathStatus = DeathState.Dying;

                this.clearCollisionBoxes();
                this.passable = true;
                this.setController(this.deathController);

                if (collisions.length > 0) {

                    var knockbackForce = this.getKnockbackForce(collisions[0].parentObject);
                    this.velocity = knockbackForce;
                    this.targetVelocity = new Point(0, 0);
                    // this.addDamageEffect(knockbackForce);
                }
            }
        }
        addDamageEffect(knockbackForce) {
            var dmgEffect = new ParticleSystem("DamageEffect");
            dmgEffect.effectAreaOrigin = this.location;
            var force = new Point(Math.round(knockbackForce.X * 100) / 100, Math.round(knockbackForce.Y * 100 / 100));
            force.divide(new Point(4, 4));
            var altVel = (-force.X - 1) + "~" + (-force.X + 1) + ", " + (-force.Y - 1) + "~" + (-force.Y + 1);
            
            dmgEffect.setParticleAltVelocity(altVel);
            currentLevel.addParticleEffect(dmgEffect);
        }

        getKnockbackForce(damageSource) {
            var collision = this.getCollisionVector(damageSource);
            var knockbackAngle = Math.atan2(collision.Y, collision.X);
            var knockbackForce = new Point( Math.cos(knockbackAngle), Math.sin(knockbackAngle) );

            knockbackForce.normalize();
            knockbackForce.multiply(new Point(3, 3));
            
            return knockbackForce;
        }

        updateDeath() {
            if (this.deathStatus === DeathState.Dying) {
                if (this.deathTimer > 0) {
                    this.deathTimer -= 1;
                }
                else
                    this.deathStatus = DeathState.Dead;
            }
            else if (this.deathStatus === DeathState.Dead) {
                currentLevel.removeActor(this);
                currentLevel.effectLayer.removeChild(this.deathCombo, this.deathScore);

                // var deathEffect = new ParticleSystem("EnemyDeathEffect");
                // deathEffect.effectAreaOrigin = this.location;
                // currentLevel.addParticleEffect(deathEffect);
            }
        }
        updateDeathScore() {
            if (!this.deathCombo)
                return;
            
            if (this.deathTimer % 4 == 0) {
                if (this.deathCombo.color === "#f5f4eb") {
                    this.deathCombo.color = "#e18d79";
                    this.deathScore.color = "#e18d79";
                }
                else {
                    this.deathCombo.color = "#f5f4eb";
                    this.deathScore.color = "#f5f4eb";
                }
            }
        }

    }
    
    return Enemy;

});