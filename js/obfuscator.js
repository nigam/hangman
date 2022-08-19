hangman.obfuscator = (function obfuscator() {

    const SEED_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    function cyrb128(str) {
        let h1 = 1779033703, h2 = 3144134277,
            h3 = 1013904242, h4 = 2773480762;
        for (let i = 0, k; i < str.length; i++) {
            k = str.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
        }
        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
        return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
    }

    function mulberry32(a) {
        return function() {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }

    function seedRnd(seedValue, seedChars, length) {
        const seed = cyrb128(seedValue);
        const rand = mulberry32(seed[0]);
        let result = "";
        for (let i = 0; i < length; i++) {
            const charIndex = Math.round((seedChars.length-1)*rand());
            result += seedChars.charAt(charIndex);
        }
        return result;
    }

    function XOR_hex(a, b) {
        let res = "",
            i = a.length,
            j = b.length;
        while (i-->0 && j-->0)
            res = (parseInt(a.charAt(i), 16) ^ parseInt(b.charAt(j), 16)).toString(16) + res;
        return res;
    };

    return {
        obfuscate: function(seed, word) {            
            const rndValue = seedRnd(seed, SEED_CHARS, word.length);
            const obfuscatedWordHex = XOR_hex(word.hexEncode(), rndValue.hexEncode());
            const obfuscatedWordB64 = btoa(obfuscatedWordHex.hexDecode());
            return obfuscatedWordB64;
        },        
        deobfuscate: function(seed, obfuscatedWordB64) {
            const obfuscatedWord = atob(obfuscatedWordB64)
            const obfuscatedWordHex = obfuscatedWord.hexEncode();
            const rndValue = seedRnd(seed, SEED_CHARS, obfuscatedWordHex.length/4);
            const unobfuscatedWordHex = XOR_hex(obfuscatedWordHex, rndValue.hexEncode());
            return unobfuscatedWordHex.hexDecode();
        }
    }
})();