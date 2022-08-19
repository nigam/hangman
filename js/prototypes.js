hangman.prototypes = (function () {

    function init() {
        String.prototype.hexEncode = function() {
            let hex;
            let result = "";
            for (let i=0; i<this.length; i++) {
                hex = this.charCodeAt(i).toString(16);
                result += ("000"+hex).slice(-4);
            }
            return result
        };

        String.prototype.hexDecode = function() {
            let j;
            let hexes = this.match(/.{1,4}/g) || [];
            let back = "";
            for(j = 0; j<hexes.length; j++) {
                back += String.fromCharCode(parseInt(hexes[j], 16));
            }
            return back;
        };
    }

    return {
        init: init
    }
})();