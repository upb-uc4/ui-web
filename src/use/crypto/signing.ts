import { arrayBufferToBase64, base64ToArrayBuffer, signingAlgorithm } from "../crypto/certificates";
import { ec } from "elliptic";
import BN from "bn.js";
const Signature = require("elliptic/lib/elliptic/ec/signature.js");
import * as asn1js from "asn1js";

// map for easy lookup of the "N/2" and "N" value per elliptic curve
const p256ec = new ec("p256");
const p384ec = new ec("p384");

const ordersForCurve = {
    secp256r1: {
        halfOrder: p256ec.n?.shrn(1),
        order: p256ec.n,
    },
    secp384r1: {
        halfOrder: p384ec.n?.shrn(1),
        order: p384ec.n,
    },
};

export function preventMalleability(signature: { r: Uint8Array; s: Uint8Array }, curveParams: { name: string }) {
    let halfOrder = undefined;
    switch (curveParams.name) {
        case "P-256":
            halfOrder = ordersForCurve.secp256r1.halfOrder;
            break;
        case "P-384":
            halfOrder = ordersForCurve.secp384r1.halfOrder;
            break;
        default:
            break;
    }

    let order = undefined;
    switch (curveParams.name) {
        case "P-256":
            order = ordersForCurve.secp256r1.order;
            break;
        case "P-384":
            order = ordersForCurve.secp384r1.order;
            break;
        default:
            break;
    }

    if (!(halfOrder && order)) {
        throw new Error(
            'Can not find the half order needed to calculate "s" value for immalleable signatures. Unsupported curve name: ' +
                curveParams.name
        );
    }

    const bnS = new BN(signature.s);

    // in order to guarantee 's' falls in the lower range of the order, as explained in the above link,
    // first see if 's' is larger than half of the order, if so, it needs to be specially treated
    if (bnS.cmp(halfOrder) === 1) {
        // module 'bn.js', file lib/bn.js, method cmp()
        // convert from BigInteger used by jsrsasign Key objects and bn.js used by elliptic Signature objects
        const bigNum = order;
        const buffer = bigNum.sub(bnS).toArrayLike(Buffer);
        signature.s = new Uint8Array(buffer);
    }

    return signature;
}

export function _checkMalleability(signature: { r: Uint8Array; s: Uint8Array }, curveParams: { name: string }) {
    let halfOrder = undefined;
    switch (curveParams.name) {
        case "P-256":
            halfOrder = ordersForCurve.secp256r1.halfOrder;
            break;
        case "P-384":
            halfOrder = ordersForCurve.secp384r1.halfOrder;
            break;
        default:
            break;
    }

    if (!halfOrder) {
        throw new Error(
            'Can not find the half order needed to calculate "s" value for immalleable signatures. Unsupported curve name: ' +
                curveParams.name
        );
    }

    const bnS = new BN(signature.s);

    // in order to guarantee 's' falls in the lower range of the order, as explained in the above link,
    // first see if 's' is larger than half of the order, if so, it is considered invalid in this context
    if (bnS.cmp(halfOrder) === 1) {
        // module 'bn.js', file lib/bn.js, method cmp()
        return false;
    }

    return true;
}

export async function signProposal(base64Proposal: string, privateKey: CryptoKey) {
    const crypto = window.crypto.subtle;
    const proposal = base64ToArrayBuffer(base64Proposal);

    const signature = await crypto.sign(signingAlgorithm, privateKey, proposal);

    var r = signature.slice(0, 32);
    var s = signature.slice(32);

    const newSignature = preventMalleability({ r: new Uint8Array(r), s: new Uint8Array(s) }, { name: signingAlgorithm.namedCurve });

    const sig = new Signature({ r: newSignature.r, s: newSignature.s });

    return arrayBufferToBase64(sig.toDER());
}

/**
 * Verify the proposal signature
 * @param proposal base64 encoded proposal protobuf
 * @param signature base64 encoded DER representation of r and s parameter of signature
 */
export async function verifyProposalSignature(proposal: string, signature: string, publicKey: CryptoKey) {
    const crypto = window.crypto.subtle;
    const digest = await crypto.digest("SHA-256", base64ToArrayBuffer(proposal));
    const exportedPublicKey = Buffer.from(await crypto.exportKey("raw", publicKey));

    const berObject = (asn1js.fromBER(base64ToArrayBuffer(signature)).result.toJSON() as any).valueBlock.value;

    const r = fromHexString(berObject[0].valueBlock.valueHex);
    const s = fromHexString(berObject[1].valueBlock.valueHex);

    const sig = { r, s };

    return _checkMalleability(sig, { name: signingAlgorithm.namedCurve }) && p256ec.verify(new Uint8Array(digest), sig, exportedPublicKey);
}

export function fromHexString(hexString: string) {
    const buf = hexString.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16));
    return buf ? new Uint8Array(buf) : new Uint8Array();
}
