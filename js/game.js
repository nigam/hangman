hangman.game = (function () {

    const dom = hangman.dom;
    const scenes = hangman.scenes;
    const draw = hangman.draw;

    const defaultLangugeTag = "en";

    let gameRunning;
    let languageTag;
    let languageHintText;
    let secretWord;
    let guessedLetters;
    let incorrectGuesses;


    const nop = function() {
        // no operation
    }

    function initOnce() {
        hangman.prototypes.init();
        initVars();
        initLanguageTag();
        dom.initTexts(hangman.dictionary, languageTag, defaultLangugeTag);
        initListeners();
        dom.initSecretWordInput();
        populateLanguages(hangman.languages, hangman.game.getLanguage());
        dom.initGuessLetterInput();
        hangman.draw.init();
        startFirstScene();
        hangman.game.initOnce = nop;
    }

    function initVars() {
        gameRunning = true;
        incorrectGuesses = 0;
        guessedLetters = "";
        secretWord = "";
    }

    function getTranslationTag() {
        let tag = window.navigator.language.toLocaleLowerCase();
        if (tag.indexOf("-") > 0) {
            tag = tag.split("-")[0];
        }
        return tag;
    }

    function initLanguageTag() {
        languageTag = getTranslationTag();
    }

    function initListeners() {
        const listeners = hangman.listeners;
        for (const id in listeners) {
            const element = document.getElementById(id);
            const listener = listeners[id];
            for (let i = 0; i < listener.length; i++) {
                const event = listener[i];
                element.addEventListener(event.type, event.callback);
            }
        }
    }

    function getNativeLanguagePart(language)  {
        let nativeText = ""
        if (language.native && language.native.length > 0) {
            nativeText = " (" + language.native + ")";
        }
        return nativeText;
    }

    function populateLanguages(languages, selectTag) {
        const element = document.getElementById("languageSelect");
        element.innerHTML = "";
        for (const tag in languages) {
            const language = languages[tag];
            const nativeText = getNativeLanguagePart(language);
            hangman.dom.createLanguageOption(language.name + nativeText, tag, selectTag);
        }
    }

    function startFirstScene() {
        const seed = dom.readSeedFromQuery();
        const obfuscatedWord = dom.readWordFromQuery();
        const languageTag = dom.readLanguageTagFromQuery();
        if (obfuscatedWord) {
            secretWord = hangman.obfuscator.deobfuscate(seed, obfuscatedWord);
            hangman.game.setLanguage(languageTag);
            scenes.newSharedGame.start();
        } else {
            scenes.newGame.start();
        }
    }

    function verifyGuess(key) {
        if (guessedLetters.indexOf(key) > -1) {
            dom.highlightGuessedLetter(key, guessedLetters.length);
            return;
        }

        let newLetterFound = false;
        for (let i = 0; i < secretWord.length; i++) {
            const element = secretWord[i];
            if (element === key) {
                newLetterFound = true;
                dom.updateContent("hiddenLetter" + i, key);
            }
        }

        if (guessedLetters.indexOf(key) < 0) {
            guessedLetters += key;
            dom.createGuessedLetter(key, guessedLetters.length);
        }

        if (!newLetterFound) {
            incorrectGuesses++;
            draw.update(incorrectGuesses, handleGameOver);
        } else if (isGameWon()) {
            handleGameWon();
        }
    }

    function isLetter(event) {
        const key = event.data;
        return key.toLowerCase() != key.toUpperCase()
            && key.length == 1
            //&& !event.ctrlKey
            //&& !event.altKey;
    }

    function isGameWon() {
        let gussedLetters = 0;
        for (let i = 0; i < secretWord.length; i++) {
            if (!hangman.dom.isLetterHidden(i)) {
                gussedLetters++;
            }
        }
        return (gussedLetters == secretWord.length)
    }

    function handleGameWon() {
        draw.highlightGameWon();
        setTimeout(scenes.gameWon.start, 250);
        endGame();
    }

    function handleGameOver() {
        draw.highlightGameOver();
        const texts = hangman.dictionary["discloseWordText"];
        const translationTag = getTranslationTag();
        const text = dom.getTextByTag(texts, translationTag, defaultLangugeTag);
        dom.discloseWord(text, secretWord);
        setTimeout(scenes.gameOver.start, 250);
        endGame();
    }

    function endGame() {
        gameRunning = false;
        dom.setGuessLetter("");
        dom.disable("guessLetterInput");
    }

    async function shareGame() {
        // Share must be triggered by "user activation"
        try {
            const seed = Date.now().toString();
            const obfuscatedWordB64 = hangman.obfuscator.obfuscate(seed, secretWord);
            const language = hangman.game.getLanguage();
            const query = `t=${seed}&w=${encodeURIComponent(obfuscatedWordB64)}&l=${language}`;
            const href = window.top.location.href.split("?")[0];
            const shareData = {
                text: "Play hangman",
                title: "Hangman",
                url: `${href}?${query}`
            };
            await navigator.share(shareData)
            // Hangman link shared successfully
        } catch (err) {
            hangman.dom.setShareError(`Error: ${err}`);
        }
    }

    return {
        initOnce: initOnce,
        setLanguage: function (language) {
            languageTag = language.toLocaleLowerCase();
        },
        getLanguage: function () {
            return languageTag;
        },
        initLanguageHintText: function() {
            const language = hangman.languages[hangman.game.getLanguage()]
            const nativeText = getNativeLanguagePart(language);
            languageHintText = language.name + nativeText;
            hangman.draw.languageHint(languageHintText);
        },
        getLanguageHintText: function() {
            return languageHintText;
        },
        setSecretWord: function (word) {
            secretWord = word.trim().toUpperCase();
        },
        getSecretWordLength: function () {
            return secretWord.length;
        },
        getIncorrectGuesses: function () {
            return incorrectGuesses;
        },
        isGameRunning: function () {
            return gameRunning;
        },
        addGuessedLetter: function (key) {
            guessedLetters += key;
        },
        shareGame: shareGame,
        handleGameOver: handleGameOver,
        restartGame: function () {
            initVars();
            hangman.dom.restartGame();
            scenes.askForWord.start();
        },
        inputChanged: function(event) {
            if (gameRunning) {
                if (event.inputType === "insertFromPaste") {
                    // Accept any char as valid since it was pasted.
                    verifyGuess(this.value.toUpperCase());
                } else if (event.inputType === "insertText" || event.inputType === "insertCompositionText") {
                    hangman.game.insertText(event);
                }
            }
        },
        insertText: function(event) {
            if (gameRunning) {
                if (!isLetter(event) ) {
                    // not accepted as a letter
                    if (event.ctrlKey) {
                        // skip adding ? to allow for insertFromPaste event
                    } else {
                        // add '?' to indicate letter not accepted
                        hangman.dom.setGuessLetter("?");                        
                    }
                    return true;
                }
                hangman.dom.setGuessLetter(event.data);
                let pressedKey = event.data.toUpperCase();
                verifyGuess(pressedKey);
            }
        },
        keyUp: function() {
            hangman.dom.setGuessLetter("")
        }
    }
})();
