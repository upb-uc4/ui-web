import EncryptedPrivateKey from "@/api/api_models/certificate_management/EncryptedPrivateKey";
import { deriveKeyFromPassword, unwrapKey, base64ToArrayBuffer } from "@/use/crypto/certificates";
import { MutationTypes } from "@/use/store/mutation-types";
import { useStore } from "@/use/store/store";

export default function resetState(encryptionPassword: string) {
    useStore().commit(MutationTypes.RESET_STATE);

    useStore().commit(MutationTypes.SET_DECRYPT_PRIVATE_KEY_MODAL, async (encKey: EncryptedPrivateKey) => {
        const wrappingKey = await deriveKeyFromPassword(encryptionPassword, encKey.salt);
        return await unwrapKey(base64ToArrayBuffer(encKey.key), wrappingKey.key, base64ToArrayBuffer(encKey.iv));
    });
}
