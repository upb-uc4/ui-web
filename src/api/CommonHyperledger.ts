import Common from "./Common";
import axios, { AxiosError, AxiosResponse } from "axios";

export default class CommonHyperledger extends Common {
    protected static endpoint = "";

    static async getHyperledgerVersion(): Promise<HyperledgerVersion> {
        const instance = axios.create({
            baseURL: process.env.VUE_APP_API_BASE_URL + this.endpoint,
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8",
            },
        });

        return await instance
            .get(`/version/hyperledger`)
            .then((response: AxiosResponse) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                return { chaincodeVersion: "unavailable", hlfApiVersion: "unavailable" };
            });
    }
}

export interface HyperledgerVersion {
    hlfApiVersion: string;
    chaincodeVersion: string;
}
