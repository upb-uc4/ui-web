export default interface ServiceVersion {
    version: string;
    changelogURL?: string;
    hyperledgerVersion?: HyperledgerVersion;
}

export interface HyperledgerVersion {
    hlfApiVersion: string;
    chaincodeVersion: string;
}
