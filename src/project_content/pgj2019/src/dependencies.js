require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    waitSeconds: 200,
    paths: {

      "point" : "src/gameObjects/point",
      "collisionBox" : "src/gameObjects/collisionBox",
      "gameObject" : "src/gameObjects/gameObject",
      "objectFactory": "src/gameObjects/objectFactory",

      "tile": "src/levels/tile",
      "actor": "src/actors/actor",
      "prop": "src/props/prop", 
      "parallaxProp": "src/props/parallaxProp", "reactiveProp": "src/props/reactiveProp",
      "collectible": "src/props/collectible", "transition": "src/levels/transition",

      "menuItem": "src/interface/menuItem", "menuGrid": "src/interface/menuGrid",
      "mainMenu": "src/interface/mainMenu", "levelSelectMenu": "src/interface/levelSelectMenu", "levelEndMenu": "src/interface/levelEndMenu",
      "statsDisplay": "src/interface/statsDisplay", "healthBar": "src/interface/healthBar",

      "particle": "src/effects/particle", "particleSystem": "src/effects/particleSystem", "paintArea": "src/gameObjects/paintArea",

      "actorController": "src/actors/actorController",
      "enemy": "src/actors/enemy", "shard": "src/props/shard",
      "enemyBehavior": "src/actors/enemyBehavior", 'enemySpawnPoint': "src/levels/enemySpawnPoint",
      "player": "src/actors/player",

      "attack": "src/action/attack", "chargeAttack": "src/action/chargeAttack", "spinAttack": "src/action/spinAttack",

      "level": "src/levels/level", "levelParser": "src/levels/levelParser",
      "game": "src/game"
    }
});
  
requirejs(['point', 'menuItem', 'menuGrid'], function() {

    requirejs([
        'mainMenu', 'levelSelectMenu', 'levelEndMenu', 'gameObject', 'collisionBox', 'actorController',
        'levelParser', 'particle', 'healthBar', 'statsDisplay', 'enemyBehavior'
    ], function() {

        requirejs(['tile', 'actor', 'prop', 'transition', 'particleSystem'], function() {

            requirejs(['enemy', 'shard', 'attack', 'collectible', 'parallaxProp', 'reactiveProp', 'enemySpawnPoint', 'paintArea'], function() {

                requirejs(['objectFactory', 'chargeAttack', 'spinAttack'], function() {

                    requirejs(['player', 'level'], function() {

                        requirejs(['game']);

                    });
                });
            });
        });
    });
});