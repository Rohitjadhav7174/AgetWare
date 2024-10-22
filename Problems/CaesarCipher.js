function encodeMessage(message, shift) {
    return message.split('').map(char => {
        if (/[a-zA-Z]/.test(char)) {
            const charCode = char.charCodeAt();
            const base = charCode >= 65 && charCode <= 90 ? 65 : 97; 
            return String.fromCharCode(((charCode - base + shift) % 26 + 26) % 26 + base); 
         }
        return char;
    }).join('');
}

function decodeMessage(encodedMessage, shift) {
    return encodeMessage(encodedMessage, -shift); 
}
let originalMessage = "HELLO WORLD";
let shiftAmount = 3;

let encoded = encodeMessage(originalMessage, shiftAmount);
let decoded = decodeMessage(encoded, shiftAmount);

console.log("Original:", originalMessage);
console.log("Encoded:", encoded);
console.log("Decoded:", decoded);
