hangman.scenes = (function () {

    const dom = hangman.dom;
    
    const newGame = {
        // This scene forces user interaction so browser later allows setting focus programmatically.
        name: "sceneNewGame",
        next: function() {
            //dom.easeOut(".newGame", 100, function() {
                newGame.hide();
                askForWord.start();
            //});
        },
        start: function() {
            dom.show(newGame.name);
            setTimeout(dom.focus("startGameButton"), 100);
            dom.easeIn(".newGame", 250);
        },
        hide: function() {
            dom.hide(newGame.name);
        }
    }

    const newSharedGame = {
        // This scene forces user interaction so browser later allows setting focus programmatically.
        name: "sceneNewSharedGame",
        next: function() {
            //dom.easeOut(".newSharedGame", 100, function() {
                newSharedGame.hide();
                hangman.game.initLanguageHintText();
                gamePlay.start();
            //});
        },
        start: function() {
            dom.show(newSharedGame.name);
            setTimeout(dom.focus("startSharedGameButton"), 100);
            dom.easeIn(".newSharedGame", 250);
        },
        hide: function() {
            dom.hide(newSharedGame.name);
        }
    }

    const askForWord = {
        name: "sceneAskForWord",
        next: function(formData) {
            //dom.easeOut(".formContainer", 100, function() {
                hangman.game.setSecretWord(formData.secretWordInput);
                hangman.game.setLanguage(formData.selectedLanguage);
                hangman.game.initLanguageHintText();
                askForWord.hide();
                shareOrPlay.start();
            //});
        },
        start: function() {
            dom.show(askForWord.name);
            setTimeout(dom.focus("secretWordInput"), 100);
            dom.easeIn(".formContainer", 150);
        },
        hide: function() {
            dom.hide(askForWord.name);
        }
    };

    const shareOrPlay = {
        name: "sceneShareOrPlay",
        share: function() {
            hangman.game.shareGame();
        },
        next: function() {
            shareOrPlay.hide();
            gamePlay.start();
        },
        restart: function() {
            shareOrPlay.hide();
            hangman.game.restartGame();
        },
        start: function() {
            dom.clear("shareResult");
            dom.show(shareOrPlay.name);
            setTimeout(dom.focus("shareButton"), 100);
            dom.easeIn(".shareOrPlay", 150);
        },
        hide: function() {
            dom.hide(shareOrPlay.name);
        }
    };

    const gamePlay = {
        name: "sceneGamePlay",
        start: function() {
            dom.enable("guessLetterInput");
            dom.createHiddenLetters(hangman.game.getSecretWordLength());
            dom.show(gamePlay.name);
            setTimeout(dom.focus("guessLetterInput"), 100);
            //dom.easeIn("#sceneGamePlay", 250);
        },
        hide: function() {
            dom.hide(gamePlay.name);
        }
    };

    const gameWon = {
        name: "sceneGameWon",
        restart: function() {
            //dom.easeOut("#sceneGamePlay", 100, function() {
                gamePlay.hide();
            //});
            //dom.easeOut(".gameEndSuccess", 250, function() {
                gameWon.hide();
                hangman.game.restartGame();
            //});
        },
        start: function() {
            dom.show(gameWon.name);
            setTimeout(dom.focus("playAgainButton"), 100);
            //dom.easeIn(".gameEndSuccess", 150);
        },
        hide: function() {
            dom.hide(gameWon.name);
        }
    };

    const gameOver = {
        name: "sceneGameOver",
        restart: function() {
            //dom.easeOut("#sceneGamePlay", 100, function() {
                gamePlay.hide();
            //});
            //dom.easeOut(".gameEndFailed", 250, function() {
                gameOver.hide();
                hangman.game.restartGame();
            //});
        },
        start: function() {
            dom.show(gameOver.name);
            setTimeout(dom.focus("tryAgainButton"), 100);
            //dom.easeIn(".gameEndFailed", 150);
        },
        hide: function() {
            dom.hide(gameOver.name);
        }
    };


    return {
        newGame: newGame,
        newSharedGame: newSharedGame,
        askForWord: askForWord,
        shareOrPlay: shareOrPlay,
        gamePlay: gamePlay,
        gameWon: gameWon,
        gameOver: gameOver
    }
})();