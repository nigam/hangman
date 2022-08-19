window.onload = function() {
    hangman.game.initOnce();
};

const hangman = (function () {
    return {
        prototypes: undefined,
        languages: undefined,
        dictionary: undefined,
        scenes: undefined,
        draw: undefined,
        obfuscator: undefined,
        dom: undefined,
        game: undefined,
        listeners: undefined,
    }
})();