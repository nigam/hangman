hangman.dom = (function () {

    const canvasHeightRatio = 0.6;

    function unhighlightGuessedLetter(element) {
        element.style.color = "#707070";
        element.style.backgroundColor = "inherit";
    }

    function getQueryParams() {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        return params;
    }

    return {
        getWordFormData: function(event) {
            let formData = {};
            for (let i = 0; i < event.target.elements.length; i++) {
                const element = event.target[i];
                switch (element.id) {
                    case "secretWordInput": 
                        formData.secretWordInput = element.value; 
                        break;
                    case "languageSelect":
                        if (element.selectedOptions.length > 0) {
                            formData.selectedLanguage = element.selectedOptions[0].value;
                        } else {
                            // No language was selected.
                        }
                        break;
                    default:
                        break;
                }
            }
            return formData;
        },
        initGuessLetterInput: function() {
            const element = document.getElementById("guessLetterInput");
            element.maxLength = 1;
        },
        initCanvas: function() {
            const element = document.querySelector("canvas");
            const ctx = element.getContext("2d");
            ctx.lineWidth = ctx.canvas.width / 100;
            ctx.strokeStyle = "#444444";
            return ctx;
        },
        createHiddenLetters: function(letters) {
            const parent = document.getElementById("hiddenLetterContainer");
            for (let i = 0; i < letters; i++) {
                const div = document.createElement("div");
                div.innerHTML = "_";
                div.setAttribute("class", "hiddenLetter");
                div.setAttribute("id", "hiddenLetter" + i);
                parent.appendChild(div);
            }
        },
        createLanguageOption: function(language, tag, selectTag) {
            const parent = document.getElementById("languageSelect");
            const option = document.createElement("option");
            option.innerHTML = language;
            option.setAttribute("value", tag);
            if (tag.toLocaleLowerCase() === selectTag) {
                option.setAttribute("selected", "");
            }
            parent.appendChild(option);
        },
        createGuessedLetter: function(content, guessedLettersLength) {
            const div = document.createElement("div");
            div.innerHTML = content;
            div.setAttribute("class", "guessedLetter");
            div.setAttribute("id", "guessedLetter" + (guessedLettersLength-1));
            const parent = document.getElementById("guessedLetterContainer");
            parent.appendChild(div);
        },
        setGuessLetter: function(key) {
            const element = document.getElementById("guessLetterInput");
            element.value = key;
        },
        getSecretWord: function() {
            return document.getElementById("secretWordInput").value;
        },
        getCanvasHeightRatio: function() {
            return canvasHeightRatio;
        },
        updateContent: function(id, content) {
            const element = document.getElementById(id);
            element.innerHTML = content;
        },
        disable: function(id) {
            document.getElementById(id).disabled = true;
        },
        enable: function(id) {
            document.getElementById(id).disabled = false;
        },
        hide: function(id) {
            document.getElementById(id).setAttribute("style", "display:none;");
        },
        show: function(id) {
            document.getElementById(id).setAttribute("style", "display:block;");
        },
        focus: function(id) {
            document.getElementById(id).focus();
        },
        clear: function(id) {
            document.getElementById(id).innerHTML = "";
        },
        initSecretWordInput: function() {
            document.getElementById("secretWordInput").maxLength = 50;
        },
        highlightGuessedLetter: function(pressedKey, guessedLettersLength) {
            for (let i = 0; i < guessedLettersLength; i++) {
                const element = document.getElementById("guessedLetter"+i);
                if (element.innerHTML === pressedKey) {
                    element.style.color = "red";
                    element.style.backgroundColor = "yellow";
                    setTimeout(unhighlightGuessedLetter, 1000, element);
                }
            }
        },
        easeIn: function(selector, duration, callback, args) {
            document.querySelector(selector).animate(
                { opacity: [0, 1] }, 
                { duration: duration, iterations: 1, easing: "ease-in" }
            ).onfinish = (e) => {
                e.target.effect.target.style.opacity = 1;
                if (callback) {
                    callback(args);
                }
            };
        },
        easeOut: function(selector, duration, callback, args) {
            document.querySelector(selector).animate(
                { opacity: [1, 0] },
                { duration: duration, iterations: 1, easing: "ease-out" }
            ).onfinish = (e) => {
                e.target.effect.target.style.opacity = 0;
                if (callback) {
                    callback(args);
                }
            };
        },
        readSeedFromQuery: function() {
            return getQueryParams().t;
        },
        readWordFromQuery: function() {
            return getQueryParams().w;
        },
        readLanguageTagFromQuery: function() {
            return getQueryParams().l;
        },        
        isLetterHidden: function(index) {
            const hiddenLetter = document.getElementById("hiddenLetter" + index);
            return hiddenLetter.innerHTML === "_";
        },
        getCanvasWidth: function(colorIndex) {
            return document.querySelector("canvas").width;
        },
        getCanvasHeight: function(colorIndex) {
            return document.querySelector("canvas").height;
        },
        discloseWord: function(text, word) {
            hangman.dom.updateContent("discloseWord", text + word);
        },
        setShareError: function(error) {
            const resultPara = document.getElementById("shareResult");
            resultPara.textContent = error;
        },
        getTextByTag: function(texts, tag, defaultTag) {
            let result = texts[tag];
            if (!result) {
                result = texts[defaultTag];
            }
            return result;
        },
        initTexts: function(dictionary, tag, defaultTag) {
            for (const id in dictionary) {
                const texts = dictionary[id];
                const element = document.getElementById(id);
                if (element) {
                    element.innerHTML = hangman.dom.getTextByTag(texts, tag, defaultTag);
                }
            }
        },
        restartGame: function() {
            document.getElementById("hiddenLetterContainer").innerHTML = "";
            document.getElementById("guessedLetterContainer").innerHTML = "";
            document.getElementById("secretWordInput").value = "";
            hangman.draw.clearAll();
            hangman.dom.initCanvas();
        }
    }
})();