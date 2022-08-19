hangman.draw = (function () {

    let ctx;
    let margin = 0;


    let redrawHandle = null;
    let redrawTimeout = 0;

    function init() {
        resizeCanvas();
        ctx = hangman.dom.initCanvas();
        ctx.beginPath();
        hangman.draw.languageHint();
        window.addEventListener("resize", resizeCanvas, false);
    }

    function resizeCanvas() {
        if (redrawHandle == null) {
            redrawHandle = setTimeout(redrawAll, redrawTimeout);
        }
    }

    function redrawAll() {
        const canvas = document.querySelector("canvas");

        const minInnerSize = Math.min(window.innerWidth, window.innerHeight);
        const heightMargin = 200;

        if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            canvas.height = Math.min(window.innerHeight  - heightMargin, 400);
        } else {
            canvas.height = minInnerSize - heightMargin;
        }
        canvas.width = canvas.height * 1.5;
        const widthMargin = 150;
        if (canvas.width > window.innerWidth - widthMargin) {
            canvas.width = window.innerWidth - widthMargin;
            canvas.height = canvas.width / 1.5;
        }
        margin = canvas.height * (46 / 360);
        const guessLetterInput = document.getElementById("guessLetterInput");
        guessLetterInput.setAttribute("style", "width:" + canvas.width + "px;");
        ctx = hangman.dom.initCanvas();
        ctx.beginPath();
        hangman.draw.languageHint();
        const incorrectGuesses = hangman.game.getIncorrectGuesses();
        if (incorrectGuesses > 0) {
            for (let i=1; i < incorrectGuesses+1; i++) {
                update(i);
            }
        }
        clearTimeout(redrawHandle);
        redrawTimeout = 250;
        redrawHandle = null;
    }

    function clearAll() {
        const canvas = document.querySelector("canvas");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
    }

    function changeColor(colorIndex) {
        const width = hangman.dom.getCanvasWidth();
        const height = hangman.dom.getCanvasHeight()
        const imgData = ctx.getImageData(0, 0, width, height);
        for (let i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i+colorIndex] = 150;
        }
        ctx.putImageData(imgData, 0, 0);
    }

    function update(incorrectGuesses, gameOverCallback) {
        const draw = hangman.draw;
        switch (incorrectGuesses) {
            case 1: draw.hill(); break;
            case 2: draw.line1(); break;
            case 3: draw.line2(); break;
            case 4: draw.line3(); break;
            case 5: draw.line4(); break;
            case 6: draw.head(); break;
            case 7: draw.body(); break;
            case 8: draw.leftArm(); break;
            case 9: draw.rightArm(); break;
            case 10: draw.leftLeg(); break;
            case 11: {
                draw.rightLeg();
                if (gameOverCallback) {
                    gameOverCallback();
                } // else just redrawing state
                break;
            }
            default: {
                // Draw update failed, unhandled guess
            }
        }
    }


    return {
        init: init,
        highlightGameWon: function() {
            changeColor(1);
        },
        highlightGameOver: function() {
            changeColor(0);
        },
        clearAll: clearAll,
        update: update,
        languageHint: function() {
            const text = hangman.game.getLanguageHintText();
            if (text) {
                const fontSize = ctx.canvas.width / 25;
                ctx.font =  fontSize + "px Arial";
                ctx.fillText(text, 8, fontSize);
            }
        },
        hill: function() {
            ctx.arc(ctx.canvas.width/3, ctx.canvas.height+margin, ctx.canvas.width/3, 0, 1 * -Math.PI, true);
            ctx.stroke();
        },
        line1: function() {
            ctx.moveTo(ctx.canvas.width/3, margin);
            ctx.lineTo(ctx.canvas.width/3, ctx.canvas.height/2+margin);
            ctx.stroke();
        },
        line2: function() {
            ctx.moveTo(ctx.canvas.width/3-ctx.lineWidth/2, margin);
            ctx.lineTo(ctx.canvas.width/1.3+ctx.lineWidth/2, margin);
            ctx.stroke();
        },
        line3: function() {
            ctx.moveTo(ctx.canvas.width/3-ctx.lineWidth/2+(ctx.canvas.width/5), margin);
            ctx.lineTo(ctx.canvas.width/3.02+ctx.lineWidth/2, ctx.canvas.height/4+margin);
            ctx.stroke();
        },
        line4: function() {
            ctx.moveTo(ctx.canvas.width/1.3, margin);
            ctx.lineTo(ctx.canvas.width/1.3, ctx.canvas.height/3.66+margin);
            ctx.stroke();
        },
        head: function() {
            const headRatio = ctx.canvas.height/15;
            ctx.moveTo(ctx.canvas.width/1.3+headRatio, ctx.canvas.height/3+margin);
            ctx.arc(ctx.canvas.width/1.3, ctx.canvas.height/3+margin, headRatio, 0, 2 * Math.PI);
            ctx.stroke();
        },
        body: function() {
            const headRatio = ctx.canvas.height/15;
            ctx.moveTo(ctx.canvas.width/1.3, ctx.canvas.height/3+margin+headRatio);
            ctx.lineTo(ctx.canvas.width/1.3, ctx.canvas.height/1.6+margin);
            ctx.stroke();
        },
        leftArm: function() {
            ctx.moveTo(ctx.canvas.width/1.3, ctx.canvas.height/2.2+margin);
            ctx.lineTo(ctx.canvas.width/1.45, ctx.canvas.height/1.8+margin);
            ctx.stroke();
        },
        rightArm: function() {
            ctx.moveTo(ctx.canvas.width/1.3, ctx.canvas.height/2.2+margin);
            ctx.lineTo(ctx.canvas.width/1.18, ctx.canvas.height/1.8+margin);
            ctx.stroke();
        },
        leftLeg: function() {
            ctx.moveTo(ctx.canvas.width/1.3, ctx.canvas.height/1.6+margin-ctx.lineWidth/2);
            ctx.lineTo(ctx.canvas.width/1.42, ctx.canvas.height/1.25+margin);
            ctx.stroke();
        },
        rightLeg: function() {
            ctx.moveTo(ctx.canvas.width/1.3, ctx.canvas.height/1.6+margin-ctx.lineWidth/2);
            ctx.lineTo(ctx.canvas.width/1.18, ctx.canvas.height/1.25+margin);
            ctx.stroke();
        }
    }
})();