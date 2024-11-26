define("EnemySpawnPoint", ['Point', 'Prop', 'ParticleSystem'], function(Point, Prop, ParticleSystem) {

    const DeathState = { "Alive" : 0, "Dying": 1, "Dead": 2};

    class EnemySpawnPoint extends Prop {

        constructor(location, size, passable, spriteData, propData, enemyType) {
            super(location, size, passable, spriteData, propData);

            this.enemyType = enemyType;
            this.radius = tileSize * 4;
            this.hasSpawnedEnemy = false;
            this.hostEnemy;
            this.spawnEffect;

            this.respawnTimer = 500;
            this.respawnCount = -1;

            this.respawnsLeft = 4;
        }
        initializeSprite() {

        }
        initiateSprite() {
            this.spriteContainer.x = Math.round(this.location.X);
            this.spriteContainer.y = Math.round(this.location.Y);
        }
        handleInteraction(player) {

        }

        updateProp() {

            var delta = new Point(this.location.X - player.location.X, this.location.Y - player.location.Y);
            var distToPlayer = Math.sqrt(Math.pow(delta.X, 2) + Math.pow(delta.Y, 2));

            if (distToPlayer < this.radius * 2 && (!this.hasSpawnedEnemy || (this.respawnCount > 0 && this.respawnCount < 180)) ) {
                
                if (this.particleEffects.length == 0) {
                    
                    var particleSystem = new ParticleSystem("EnemyWarningEffect");
                    this.spawnEffect = particleSystem;
                    this.addParticleEffect(particleSystem);
                }
            }

            if (distToPlayer < this.radius && !this.hasSpawnedEnemy) {
                var particleSystem = new ParticleSystem("EnemySpawnEffect");
                this.addParticleEffect(particleSystem);

                this.hostEnemy = currentLevel.spawnNewEnemy(this.location.get());
                this.respawnsLeft -= 1;
                this.hasSpawnedEnemy = true;
                this.removeParticleSystem(this.spawnEffect);
            }

            if (this.hostEnemy ? this.hostEnemy.deathStatus === DeathState.Dead : false) {
                this.respawnCount = this.respawnTimer;
                this.hostEnemy = null;
            }
            
            if (this.respawnCount > 0) {
                this.respawnCount -= 1;
                if (this.respawnCount <= 0) {
                    this.hasSpawnedEnemy = false;
                }
            }
            
            this.updateParticleEffects();

            if (this.respawnsLeft <= 0)
                currentLevel.removeProp(this);
        }


    }

    return EnemySpawnPoint;

});