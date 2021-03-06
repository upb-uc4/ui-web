import { arrayBufferToBase64, base64ToArrayBuffer, getPublicKeyFromCertificate, signingAlgorithm } from "../crypto/certificates";
import { ec } from "elliptic";
import BN from "bn.js";
const Signature = require("elliptic/lib/elliptic/ec/signature.js");
import * as asn1js from "asn1js";
import { Endorsement } from "@/api/api_models/common/Transaction";
import { validateCertificate } from "./certificateValidation";
import Certificate from "pkijs/src/Certificate";
import * as pvutils from "pvutils";

// map for easy lookup of the "N/2" and "N" value per elliptic curve
const p256ec = new ec("p256");
const ordersForCurve = {
    secp256r1: {
        halfOrder: p256ec.n?.shrn(1),
        order: p256ec.n,
    },
};

function getHalfOrder(curve: string) {
    if (curve !== "P-256") throw new Error("Curve not supported");

    return ordersForCurve.secp256r1.halfOrder;
}

function getOrder(curve: string) {
    if (curve !== "P-256") throw new Error("Curve not supported");

    return ordersForCurve.secp256r1.order;
}

export function preventMalleability(signature: { r: Uint8Array; s: Uint8Array }, curveParams: { name: string }) {
    // from https://github.com/hyperledger/fabric-sdk-node/blob/master/fabric-common/lib/impl/CryptoSuite_ECDSA_AES.js

    // [Angelo De Caro] ECDSA signatures do not have unique representation and this can facilitate
    // replay attacks and more. In order to have a unique representation,
    // this change-set forses BCCSP to generate and accept only signatures
    // with low-S.
    // Bitcoin has also addressed this issue with the following BIP:
    // https://github.com/bitcoin/bips/blob/master/bip-0062.mediawiki
    // Before merging this change-set, we need to ensure that client-sdks
    // generates signatures properly in order to avoid massive rejection
    // of transactions.

    const halfOrder = getHalfOrder(curveParams.name);
    const order = getOrder(curveParams.name);

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
    const halfOrder = getHalfOrder(curveParams.name);

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

export async function signProtobuf(base64Protobuf: string, privateKey: CryptoKey) {
    const crypto = window.crypto.subtle;
    const proposal = base64ToArrayBuffer(base64Protobuf);

    const signature = await crypto.sign(signingAlgorithm, privateKey, proposal);

    var r = signature.slice(0, 32);
    var s = signature.slice(32);

    const newSignature = preventMalleability({ r: new Uint8Array(r), s: new Uint8Array(s) }, { name: signingAlgorithm.namedCurve });
    const sig = new Signature({ r: newSignature.r, s: newSignature.s });

    return arrayBufferToBase64(sig.toDER());
}

/**
 * Verify the protobuf signature
 * @param proposal base64 encoded protobuf
 * @param signature base64 encoded DER representation of r and s parameter of signature
 */
export async function verifyProtobufSignature(protobuf: string, signature: string, publicKey: CryptoKey) {
    const crypto = window.crypto.subtle;
    const berObject = (asn1js.fromBER(base64ToArrayBuffer(signature)).result.toJSON() as any).valueBlock.value;

    let r = fromHexString(berObject[0].valueBlock.valueHex);
    let s = fromHexString(berObject[1].valueBlock.valueHex);

    const sig = { r, s };

    let signatureValid = _checkMalleability(sig, { name: signingAlgorithm.namedCurve });

    // part of the signature might be left-padded with 0 due to DER vs IEEE encoding
    if (r[0] == 0) {
        r = r.slice(1);
    }

    const signatureForWebCrypto = new Uint8Array(r.length + s.length);
    signatureForWebCrypto.set(r, 0);
    signatureForWebCrypto.set(s, r.length);

    signatureValid =
        signatureValid && (await crypto.verify(signingAlgorithm, publicKey, signatureForWebCrypto, base64ToArrayBuffer(protobuf)));

    return signatureValid;
}

export async function verifyProposalResponsePayloadSignature(
    rawProposalResponsePayload: ArrayBuffer,
    endorsement: Endorsement,
    certificate: string
) {
    const plainText = new Uint8Array(endorsement.endorser.rawEndorserBytes.byteLength + rawProposalResponsePayload.byteLength);
    plainText.set(new Uint8Array(rawProposalResponsePayload), 0);
    plainText.set(new Uint8Array(endorsement.endorser.rawEndorserBytes), rawProposalResponsePayload.byteLength);

    const publicKey = await getPublicKeyFromCertificate(certificate);

    try {
        const ownCertPem = certificate.replace(/(-----(BEGIN|END) CERTIFICATE-----|\r|\n)/g, "");
        const berUser = pvutils.stringToArrayBuffer(pvutils.fromBase64(ownCertPem));
        const asn1User = asn1js.fromBER(berUser);
        const cert = new Certificate({ schema: asn1User.result });

        const valid = await Promise.all([
            verifyProtobufSignature(arrayBufferToBase64(plainText), endorsement.signature, publicKey),
            validateCertificate(cert),
        ]);

        return valid[0] && valid[1];
    } catch (error) {
        return false;
    }
}

export function fromHexString(hexString: string) {
    const buf = hexString.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16));
    return buf ? new Uint8Array(buf) : new Uint8Array();
}
