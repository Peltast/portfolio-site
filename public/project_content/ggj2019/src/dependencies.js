
require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        "point" : "src/gameObjects/point",
        "baseObject" : "src/gameObjects/baseObject",
        "player" : "src/gameObjects/player",
        "tile" : "src/world/tile",
        "levelParser" : "src/world/levelParser",
        "level" : "src/world/level",

        "game" : "src/game"
    }
});

requirejs(['point'], function() {

    requirejs(['baseObject'], function () {

        requirejs(['tile', 'levelParser'], function () {

            requirejs(['player', 'level'], function () {

                requirejs(['game']);
                
            });
        });
    });
});

