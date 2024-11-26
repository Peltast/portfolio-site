define("Player", [
        'Actor', 'Tile', 'Prop', 'Collectible', 'Enemy', 'Shard', 'Point', 
        'ParticleSystem', 'ActorController', 'SpinAttack', 'ParticleSystem', 'CollisionBox'],
    function (
        Actor, Tile, Prop, Collectible, Enemy, Shard, Point, 
        ParticleSystem, ActorController, SpinAttack, ParticleSystem, CollisionBox) {

    const RespawnState = { "Alive": 0, "Dying": 1, "Respawning": 2 }

    class Player extends Actor {

        constructor() {
            var playerSpriteData = {
                "spriteImage": gameAssets["Player2"],
                "spriteCollision": new Point(32, 32),
                "spriteSize": new Point(68, 80),
                "spritePosition": new Point(28, 38)
            };
            super(playerSpriteData["spriteCollision"], playerSpriteData, {});
            this.mass = 100;
            this.onGround = true;

            this.deathDuration = 30;
            this.respawnDuration = 1;
            this.respawnTimer = 0;
            this.respawnStatus = RespawnState.Alive;
            this.frozen = false;

            this.addHurtbox(null, -16, -16, 32, 36);

            this.footstepDistance = 24;
            this.lastFootstepLocation = new Point();
            this.isHoldingShard = false;

            this.spinAttack = new SpinAttack(["spinAttackMain", "spinAttackRecovery"]);

            this.deathController = new ActorController(controllerData["frozen"]);
            this.currentAttack = null;
            
            this.isChargingAttack = false;
            this.attackSpeed = 15;
            this.attackStrength = 0;
            this.attackPreviewArc = new createjs.Shape();
            this.attackPreviewArc2 = new createjs.Shape();
            this.attackPreviewArc3 = new createjs.Shape();

        }
        initiateSprite() {
            var y = 8;

            var spriteSheet = new createjs.SpriteSheet({
                "images": [this.spriteSheetImg],
                "frames": {"width": this.spriteSize.X, "height": this.spriteSize.Y, "regX": 0, "regY": 0, "count": 24},
                animations: {
                    idle: 0,
                    down: 0, leftdown: 1, left: 2, leftup: 3, up: 4, rightup: 5, right: 6, rightdown: 7,
                    downWalk: 0, leftdownWalk: 1, leftWalk: 2, leftupWalk: 3, upWalk: 4, rightupWalk: 5, rightWalk: 6, rightdownWalk: 7, 
                    attack: [8, 15, "attack", .4],
                    recovery: [16, 17, "recovery", .05]
                }
            });

            this.playerContainer = new createjs.Container();
            this.imageContainer = new createjs.Container();

            this.playerContainer.addChild(this.spriteContainer, this.imageContainer);

            this.sprite = new createjs.Sprite(spriteSheet);
            this.sprite.gotoAndPlay("idle");
            this.sprite.x = this.location.X - this.spritePosition.X;
            this.sprite.y = this.location.Y - this.spritePosition.Y;
            this.imageContainer.addChild(this.sprite);

            this.imageContainer.setBounds(this.spritePosition.X, this.spritePosition.Y, this.spriteSize.X, this.spriteSize.Y);
        }
        
        setActorDirection(direction, isMoving) {
            if (currentStatement != null)
                return;
            
            super.setActorDirection(direction, isMoving);
        }

        addParticleEffect(effectName) {
            
            var particleSystem = new ParticleSystem(effectName);
            particleSystem.effectAreaOrigin.add(this.location);
            currentLevel.foregroundLayer.addChild(particleSystem.particleContainer);

            this.particleEffects.push(particleSystem);
        }

        updateActor() {
            this.updatePlayer();
            super.updateActor();
        }
        updatePlayer() {
            if (this.isChargingAttack && this.isAbleToAttack())
                this.chargeAttack();

            if (this.respawnStatus !== RespawnState.Alive)
                this.updateRespawn();

            var distFromFootstep = Math.abs(this.location.X - this.lastFootstepLocation.X) + Math.abs(this.location.Y - this.lastFootstepLocation.Y);
            if (distFromFootstep >= this.footstepDistance) {
                this.lastFootstepLocation = this.location.get();
            }
        }
        updateState() {
            if (this.respawnStatus !== RespawnState.Alive)
                return;
            else
                super.updateState();
        }

        updatePosition(xAxis) {
            if (xAxis) {
                this.location.X += this.velocity.X;
                this.spriteContainer.rotation += this.spinVel;
            }
            else
                this.location.Y += this.velocity.Y;

            this.location = new Point(Math.floor(this.location.X * 100) / 100, Math.floor(this.location.Y * 100) / 100);
            this.checkHurtbox();
            this.handleCollisions();

            var collisions = currentLevel.checkObjectCollisions(this);

            if (collisions.length > 0)
                this.updatePositionOnCollision(collisions, xAxis);
            else if (!xAxis && this.onGround)
                this.setUnGrounded();
            
            if (xAxis)
                this.spriteContainer.x = Math.round(this.location.X);
            else
                this.spriteContainer.y = Math.round(this.location.Y);

            this.imageContainer.x = this.spriteContainer.x;
            this.imageContainer.y = this.spriteContainer.y;
        }

        addHurtbox(hurtboxObj, x, y, width, height) {
            var hurtbox;
            if (hurtboxObj) { 
                hurtbox = hurtboxObj;
            }
            else {
                var hurtbox = new CollisionBox(false, x, y, width, height);
            }
            hurtbox.setVisible(this.displayCollision);
            hurtbox.parentObject = this;

            this.hurtBoxes.push(hurtbox);
            this.imageContainer.addChild(hurtbox.collisionDisplay);
        }
        removeHurtbox(hurtbox) {
            var i = this.hurtBoxes.indexOf(hurtbox);
            if (i >= 0)
                this.hurtBoxes.splice(i, 1);

            this.imageContainer.removeChild(hurtbox.collisionDisplay);
        }
        clearCollisionBoxes() {
            for (let i = 0; i < this.hitBoxes.length; i++) {
                this.spriteContainer.removeChild(this.hitBoxes[i].collisionDisplay);
                this.hitBoxes.splice(i, 1);
                i -= 1;
            }
            for (let j = 0; j < this.hurtBoxes.length; j++) {
                this.imageContainer.removeChild(this.hurtBoxes[j].collisionDisplay);
                this.hurtBoxes.splice(j, 1);
                j -= 1;
            }
        }

        updateOrientation() {
            return;
        }
        
        setMotionState() {

            if (this.state === "" || this.state === "Walk") {
                if (this.targetVelocity.X == 0 && this.targetVelocity.Y == 0)
                    this.state = "";
                else 
                    this.state = "Walk";
            }
        }
        enactNewState() {

            super.enactNewState();
        }

        isInAttack() {
            return false;
        }
        
        updateOrientation() {
            if (this.isChargingAttack || !this.isAbleToAttack())
                return;

            super.updateOrientation();
        }

        attackHold() {
            this.isChargingAttack = true;
        }
        chargeAttack() {
            if (this.attackStrength < 1080 / this.attackSpeed) {
                this.attackStrength += 0.5;

                this.updateAttackUI();
                gameStatsDisplay.updateRecoveryTimer(this.attackStrength, 1080 / this.attackSpeed);
            }
        }
        updateAttackUI() {
            this.attackPreviewArc = this.drawAttackArc(this.attackPreviewArc, "#7e2553", this.attackStrength * this.attackSpeed, 0);

            if (this.attackStrength > 360 / this.attackSpeed) {
                this.attackPreviewArc2 = this.drawAttackArc
                    (this.attackPreviewArc2, "#ff004d", (this.attackStrength - 360 / this.attackSpeed) * this.attackSpeed, 1);
            }
            if (this.attackStrength > 720 / this.attackSpeed) {
                this.attackPreviewArc3 = this.drawAttackArc
                    (this.attackPreviewArc3, "#ffec27", (this.attackStrength - 720 / this.attackSpeed) * this.attackSpeed, 2);
            }
        }
        drawAttackArc(arc, color, angle, index) {
            if (this.spriteContainer.contains(arc))
                this.spriteContainer.removeChild(arc);

            arc = new createjs.Shape();
            arc.rotation = -90;
            arc.angle = angle;
            
            arc.graphics.beginFill(color);
            arc.graphics.arc(0, 0, spinAttackSize, 0, arc.angle * (Math.PI / 180), false).lineTo(0, 0);
            arc.graphics.closePath();

            this.spriteContainer.addChildAt(arc, index);
            return arc;
        }

        attackRelease() {
            this.isChargingAttack = false;

            if (!this.isAbleToAttack())
                return;

            this.currentAttack = this.spinAttack;
            this.currentAttack.beginAttack(this, this.attackStrength);

            if (this.spriteContainer.contains(this.attackPreviewArc))
                this.spriteContainer.removeChild(this.attackPreviewArc);
            if (this.spriteContainer.contains(this.attackPreviewArc2))
                this.spriteContainer.removeChild(this.attackPreviewArc2);
            if (this.spriteContainer.contains(this.attackPreviewArc3))
                this.spriteContainer.removeChild(this.attackPreviewArc3);

            this.attackStrength = 0;
        }
        resetAttackUI() {
            if (this.spriteContainer.contains(this.attackPreviewArc))
                this.spriteContainer.removeChild(this.attackPreviewArc);
            if (this.spriteContainer.contains(this.attackPreviewArc2))
                this.spriteContainer.removeChild(this.attackPreviewArc2);
            if (this.spriteContainer.contains(this.attackPreviewArc3))
                this.spriteContainer.removeChild(this.attackPreviewArc3);

            this.attackStrength = 0;
            gameStatsDisplay.updateRecoveryTimer(this.attackStrength, 1080 / this.attackSpeed);
        }
        setAttack(attack) {
            if (this.currentAttack)
                this.currentAttack.endAttack(this);
            this.currentAttack = attack;
            this.currentAttack.beginAttack(this);
        }

        isAbleToAttack(nextAttack) {
            if (this.frozen)
                return false;
            else if (this.respawnStatus !== RespawnState.Alive)
                return false;
            else if (this.currentAttack) {
                if (nextAttack ? this.currentAttack === nextAttack : false)
                    return false;
                if (this.currentAttack.active)
                    return false;
            }
            
            return true;
        }

        interact() {
        }
        

        pressSpecial() {
            
        }
        releaseSpecial() {
            
        }

        handleCollisions() {
            if (this.passable)
                return;
            
            var fullCollisions = currentLevel.checkObjectCollisions(this, false);

            for (let i = 0; i < fullCollisions.length; i++) {
                fullCollisions[i].handleInteraction(this);
                
                if (fullCollisions[i] instanceof Prop) {
                    if (fullCollisions[i] instanceof Collectible && this.respawnStatus === RespawnState.Alive) {
                        this.getCollectible(fullCollisions[i]);
                    }

                    if (fullCollisions[i].fatalProp)
                        this.takeDamage(fullCollisions[i]);
                }
                else if (fullCollisions[i] instanceof Shard && this.respawnStatus === RespawnState.Alive) {
                    this.getShard(fullCollisions[i]);
                }
                else if (fullCollisions[i] instanceof Tile) {
                    if (fullCollisions[i].fatalTile)
                        this.takeDamage(fullCollisions[i]);
                }
            }
        }
        handleCollidedBy(actor) { }

        getCollectible(collectible) {
            this.playSound("Collectible", .5);
            gameStatsDisplay.updateStats();

            var collectibleEffect = new ParticleSystem("CollectibleEffect");
            collectibleEffect.effectAreaOrigin = collectible.location;
            currentLevel.addParticleEffect(collectibleEffect);

            currentLevel.removeProp(collectible);
        }

        getShard(shard) {
            if (this.isHoldingShard || shard.activated)
                return;
            
            this.isHoldingShard = true;
            shard.activated = true;
        }

        giveDamage(damageObj) {
            if (damageObj instanceof Enemy) {
                if (this.currentAttack ? this.currentAttack.isInCombo() : false) {
                    this.playSound("Hit", 0.6);
                }
            }
        }
        takeDamage(collisions) {
            if (this.respawnStatus === RespawnState.Alive && transition == null) {
                this.respawnPlayer();
                this.playSound("Death", 0.6);
            }
        }

        respawnPlayer() {

            this.resetAttackUI();
            if (this.currentAttack) {
                this.currentAttack.endAttack(this);
                this.currentController.reset();
                this.currentAttack = null;
            }

            // var deathEffect = new ParticleSystem("DeathEffect");
            // deathEffect.effectAreaOrigin = this.location;
            // currentLevel.addParticleEffect(deathEffect);
            
            this.respawnStatus = RespawnState.Dying;
            // this.state = "Death";
            this.enactNewState();
            this.setController(this.deathController);
        }
        
        updateRespawn() {

            if (this.respawnTimer < this.deathDuration && this.respawnStatus === RespawnState.Dying) {
                this.respawnTimer += 1;
                if (this.respawnTimer >= this.deathDuration)
                    this.deathToRespawn();
            }
            else if (this.respawnTimer < this.respawnDuration && this.respawnStatus === RespawnState.Respawning) {
                this.respawnTimer += 1;
                if (this.respawnTimer >= this.respawnDuration)
                    this.respawnToAlive();
            }
        }
        deathToRespawn() {

            this.respawnTimer = 0;
            this.respawnStatus = RespawnState.Respawning;
            currentLevel.resetLevel();
            
            // var respawnEffect = new ParticleSystem("RespawnEffect");
            // var respawnFXLocation = currentLevel.levelSpawn.location.get();
            // respawnFXLocation.subtract(new Point(50, 50));
            // respawnEffect.effectAreaOrigin = respawnFXLocation;

            // currentLevel.addParticleEffect(respawnEffect);
        }
        respawnToAlive() {
            this.respawnTimer = 0;
            this.respawnStatus = RespawnState.Alive;

            this.isHoldingShard = false;
            shardsRetrieved = 0;
            this.orientation = "right";
            this.state = "";
            this.setController(this.defaultController);
        }

        playSound(soundName, vol) {
            if (!soundEffectsOn)
                return;
            
            var soundInstance = new Howl({
                src: [soundRoot + soundAssets[soundName]], loop: false, volume: vol
            });
            soundInstance.play();
        }

    }
    
    return Player;

});