export async function createKeyPair() {
    const crypto = window.crypto;
    const keyPair = await crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    );
    return keyPair;
}

export function buildCSR(keyPair: CryptoKeyPair) {
    //TODO
}
