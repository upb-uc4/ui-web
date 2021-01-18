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

    const operationHash = await crypto.digest("SHA-256", stringToUint(toHash));

    const operationId = arrayBufferToBase64(operationHash);

    return operationId === operation.operationId;
}

// https://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string/22373135
function stringToUint(string: string) {
    var string = btoa(unescape(encodeURIComponent(string))),
        charList = string.split(""),
        uintArray = [];

    for (var i = 0; i < charList.length; i++) {
        uintArray.push(charList[i].charCodeAt(0));
    }
    return new Uint8Array(uintArray);
}
