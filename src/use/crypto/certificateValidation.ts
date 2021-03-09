import Certificate from "pkijs/src/Certificate";
import { useStore } from "../store/store";
import CertificateChainValidationEngine from "pkijs/src/CertificateChainValidationEngine";

export const validateCertificate = async (cert: Certificate): Promise<boolean> => {
    const caCerts = await useStore().getters.getCACertificates();

    const certEngine = new CertificateChainValidationEngine({
        trustedCerts: caCerts,
        certs: [cert],
        crls: [],
    });

    return (await certEngine.verify()).result;
};
