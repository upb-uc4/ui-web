import { arrayBufferToBase64 } from "@/use/crypto/certificates";
import Operation from "../api_models/operation_management/Operation";

export async function validateOperationId(operation: Operation) {
    const crypto = window.crypto.subtle;

    const toHash =
        operation.transactionInfo.contractName +
        ":" +
        operation.transactionInfo.transactionName +
        ":" +
        operation.transactionInfo.parameters;

    const operationHash = await crypto.digest("SHA-256", new Uint8Array(toUTF8Array(toHash)));

    let operationId = arrayBufferToBase64(operationHash);

    //url base64
    operationId = operationId.replace(/\+/g, "-");
    operationId = operationId.replace(/\//g, "_");

    return operationId === operation.operationId;
}

// https://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string/22373135
function toUTF8Array(str: string) {
    var utf8 = [];
    for (var i = 0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
        } else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}
