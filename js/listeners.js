hangman.listeners = {
    "startGameButton": [{
        type: "click",
        callback: hangman.scenes.newGame.next
    }],
    "startSharedGameButton": [{
        type: "click",
        callback: hangman.scenes.newSharedGame.next
    }],
    "wordForm": [{
        type: "submit",
        callback: function(event) {
            event.preventDefault();
            const formData = hangman.dom.getWordFormData(event);
            hangman.scenes.askForWord.next(formData);
        }
    }],
    "shareButton": [{
        type: "click",
        callback: hangman.scenes.shareOrPlay.share
    }],
    "playButton": [{
        type: "click",
        callback: hangman.scenes.shareOrPlay.next
    }],
    "restartButton": [{
        type: "click",
        callback: hangman.scenes.shareOrPlay.restart
    }],
    "guessLetterInput": [
        {
            type: "input",
            callback: hangman.game.inputChanged
        }, 
        {
            type: "keyup",
            callback: hangman.game.keyUp
        },
    ],
    "playAgainButton": [{
        type: "click",
        callback: hangman.scenes.gameWon.restart
    }],
    "tryAgainButton": [{
        type: "click",
        callback: hangman.scenes.gameOver.restart
    }],
}