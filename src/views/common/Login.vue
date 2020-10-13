<template>
    <div>
        <div class="container flex flex-col h-auto max-w-full md:mt-32 lg:flex-row lg:items-center">
            <form method="POST" action="" class="flex flex-col items-center w-full mx-auto xl:w-3/4" @submit.prevent="login">
                <img src="../../assets/logo/logo_long_title_right.svg" class="md:w-1/3 w-1/2 mt-3" />
                <h1 class="mt-2 mb-10 text-4xl font-bold text-center text-gray-900 lg:text-5xl">Login to Your Account</h1>

                <div class="items-center justify-center flex-auto w-full mx-4 lg:w-3/5">
                    <div class="mb-6 text-center">
                        <i class="absolute m-3 mt-4 ml-4 text-gray-500 fas fa-envelope"></i>
                        <input
                            id="email"
                            v-model="email"
                            class="pl-10 font-semibold lg:w-3/4 form-input input-text"
                            type="text"
                            placeholder="Email"
                            :class="{ error: error }"
                            @change="hideErrors()"
                        />
                    </div>

                    <div class="mb-6 text-center">
                        <i class="absolute m-3 mt-4 ml-4 text-gray-500 fas fa-lock"></i>
                        <input
                            id="password"
                            v-model="password"
                            :type="passwordFieldType"
                            class="pl-10 font-semibold lg:w-3/4 form-input input-text"
                            placeholder="Password"
                            :class="{ error: error }"
                            @change="hideErrors()"
                        />
                        <button
                            id="togglePassword"
                            type="button"
                            tabIndex="-1"
                            class="absolute mt-1 ml-3 text-lg text-gray-500 hover:text-gray-600 focus:outline-none"
                            @click="togglePassword"
                        >
                            <i :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']" class="absolute mt-3 ml-1 mr-1 fas"></i>
                        </button>
                        <p v-if="error" class="mt-2 lg:w-3/4 lg:ml-3 xl:ml-5 error-message">Wrong username and password combination!</p>
                    </div>

                    <div class="w-full text-center lg:text-left lg:pl-16 lg:ml-3">
                        <label class="block font-semibold text-gray-500">
                            <input id="rememberMe" class="mr-2 text-blue-500 form-checkbox hover:bg-blue-600" type="checkbox" checked />
                            <span class="text-sm">Remember me</span>
                        </label>
                        <a id="forgotPassword" class="inline-block mt-2 text-sm font-semibold navigation-link" href="#">
                            Forgot Password?
                        </a>
                    </div>

                    <div class="justify-center mt-10 mb-6 text-center">
                        <button
                            id="login"
                            type="submit"
                            :disabled="isInputEmpty()"
                            class="inline-block w-2/5 sm:w-2/5 md:w-2/5 lg:w-2/4 center btn btn-blue-primary"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script lang="ts">
    import Router from "@/use/router/";
    import { useStore, store } from "@/use/store/store";
    import { Role } from "@/entities/Role";
    import UserManagement from "@/api/UserManagement";
    import { ref, onMounted } from "vue";
    import LoginResponseHandler from "@/use/helpers/LoginResponseHandler";
    import AuthenticationManagement from "@/api/AuthenticationManagement";
    import { createKeyPair, createCSR, deriveKeyFromPassword, base64ToArrayBuffer } from "@/use/crypto/certificates";
    import { load, Root } from "protobufjs";

    export default {
        components: {},
        props: [],
        setup() {
            let email = ref("");
            let password = ref("");
            let passwordFieldType = ref("password");
            let error = ref(false);
            let loginResponseHandler: LoginResponseHandler = new LoginResponseHandler();

            async function togglePassword() {
                passwordFieldType.value = isPasswordVisible() ? "password" : "text";
                let r = new Root({});

                await load("hlf-proto.json", function (err, root) {
                    if (err) throw err;
                    if (!root) return;
                    const proposalMessage = root.lookupType("protos.Proposal");
                    const chaincodeProposalPayload = root.lookupType("protos.ChaincodeProposalPayload");
                    const chaincodeInvocationSpec = root.lookupType("protos.ChaincodeInvocationSpec");
                    const chaincodeInput = root.lookupType("protos.ChaincodeInput");
                    let base64 =
                        "CpoJCmsIAxABGgwIovOW/AUQuMKLtAMiCW15Y2hhbm5lbCpANDU1YzFlNjhlODE2NDhkYjFmNDg2ZTg1NGM4YzAwZDAyYmZlNjhlNWI1OTJiMTcyZTJlZmQxYmVkMmEzOTkwYjoKEggSBnVjNC1jYxKqCAqNCAoHb3JnMU1TUBKBCC0tLS0tQkVHSU4gQ0VSVElGSUNBVEUtLS0tLQpNSUlDeHpDQ0FtMmdBd0lCQWdJVVpIQWszaDZ2OTVqQjFRNWlYOTJaZlBiTGV3OHdDZ1lJS29aSXpqMEVBd0l3CllERUxNQWtHQTFVRUJoTUNWVk14RnpBVkJnTlZCQWdURGs1dmNuUm9JRU5oY205c2FXNWhNUlF3RWdZRFZRUUsKRXd0SWVYQmxjbXhsWkdkbGNqRVBNQTBHQTFVRUN4TUdSbUZpY21sak1SRXdEd1lEVlFRREV3aHlZMkV0YjNKbgpNVEFlRncweU1ERXdNVE14TkRJek1EQmFGdzB5TVRFd01UTXhOREk0TURCYU1EZ3hEakFNQmdOVkJBc1RCV0ZrCmJXbHVNU1l3SkFZRFZRUURFeDF6WTJGc1lTMXlaV2RwYzNSeVlYUnBiMjR0WVdSdGFXNHRiM0puTVRCWk1CTUcKQnlxR1NNNDlBZ0VHQ0NxR1NNNDlBd0VIQTBJQUJBQndhOG1DMXF0ZldXZFQxV241dUE1bmdzMUlkeFFpcG81egpHN0k3RVFUQm1QQTRDNjljWHJtR2dJeEVONEtTVnpQR2RsV0Zzdy9wVWNqaWRQK2RLYnFqZ2dFck1JSUJKekFPCkJnTlZIUThCQWY4RUJBTUNBNmd3SFFZRFZSMGxCQll3RkFZSUt3WUJCUVVIQXdFR0NDc0dBUVVGQndNQ01Bd0cKQTFVZEV3RUIvd1FDTUFBd0hRWURWUjBPQkJZRUZBRzZ4TGpPem9WZTVxMS9GcjRiMjJjb1A1RlpNQjhHQTFVZApJd1FZTUJhQUZKYkF2M0VWU2kzcGs1TGV1R3JkQ1VMTXZjNEpNQ2dHQTFVZEVRUWhNQitDSFhOallXeGhMWEpsCloybHpkSEpoZEdsdmJpMWhaRzFwYmkxdmNtY3hNSDRHQ0NvREJBVUdCd2dCQkhKN0ltRjBkSEp6SWpwN0ltRmsKYldsdUlqb2lkSEoxWlNJc0ltaG1Ma0ZtWm1sc2FXRjBhVzl1SWpvaUlpd2lhR1l1Ulc1eWIyeHNiV1Z1ZEVsRQpJam9pYzJOaGJHRXRjbVZuYVhOMGNtRjBhVzl1TFdGa2JXbHVMVzl5WnpFaUxDSm9aaTVVZVhCbElqb2lZV1J0CmFXNGlmWDB3Q2dZSUtvWkl6ajBFQXdJRFNBQXdSUUloQU1ESndadVc0WUhVaDNxNThuWG1FaTdud05xVWdlcTQKcFZjWTArWG5uSmR4QWlCdS9sdXluWk9qbU45MDhURUdpaDExZjNGM1pkUDFMUityQVRGSURONm1Rdz09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0KEhh4ouW91qGu0AcpeWHgHDEsu4WjcIpuls8SQQo/Cj0IARIIEgZ1YzQtY2MaLwoeVUM0LkNlcnRpZmljYXRlOmFkZENlcnRpZmljYXRlCgMxMDEKCFdoYXRldmVy";
                    let buf = base64ToArrayBuffer(base64);

                    let message = proposalMessage.decode(new Uint8Array(buf));
                    console.log(message);
                    let message2 = chaincodeProposalPayload.decode((message as any)["payload"]);
                    console.log(message2);
                    let message3 = chaincodeInvocationSpec.decode((message2 as any)["input"]);
                    console.log(message3);
                    console.log((message3 as any)["chaincodeSpec"]["input"]);
                    //let message4 = chaincodeInput.decode((message3 as any)["chaincodeSpec"]["input"])

                    let args = (message3 as any)["chaincodeSpec"]["input"]["args"] as Uint8Array[];

                    args.forEach((e) => console.log(new TextDecoder("utf-8").decode(e)));

                    //console.log(message4);
                });
            }

            function hideErrors() {
                error.value = false;
            }

            function isPasswordVisible() {
                return passwordFieldType.value === "text";
            }

            function isInputEmpty() {
                return email.value === "" || password.value === "";
            }

            async function login() {
                const username = email.value;
                const response = await AuthenticationManagement._getRefreshToken({ username: username, password: password.value });

                const loginSuccess = loginResponseHandler.handleResponse(response);

                if (loginSuccess) {
                    Router.push("/welcome");
                } else {
                    error.value = true;
                }
            }

            return {
                email,
                password,
                passwordFieldType,
                error,
                isPasswordVisible,
                isInputEmpty,
                togglePassword,
                hideErrors,
                login,
            };
        },
    };
</script>
