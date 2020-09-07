<template>
    <modal ref="baseModal" :action="action" @cancel="close(action.CANCEL)">
        <template #header>
            <p class="text-2xl text-gray-900">Confirmation Needed</p>
        </template>
        <div class="flex flex-col">
            <p>You are about to change critical data! Please enter your password to continue.</p>
            <input
                id="enterPasswordModalPassword"
                v-model="password"
                :disabled="checking"
                type="password"
                class="w-full mt-3 form-input input-text"
                :class="{ error: hasError }"
                placeholder="Password"
                @keypress.enter="checkPassword"
            />
            <p v-if="hasError" class="error-message">Wrong Password!</p>
        </div>
        <template #footer>
            <button id="enterPasswordModalCancel" class="mr-10 btn-tertiary" @click="close(action.CANCEL)">Cancel</button>
            <button id="enterPasswordModalConfirm" class="w-24 px-2 py-2 btn btn-blue-primary" @click="checkPassword">Confirm</button>
        </template>
    </modal>
</template>

<script lang="ts">
    import Modal from "@/components/modals/Modal.vue";
    import { ref } from "vue";
    import LoginResponseHandler from "@/use/helpers/LoginResponseHandler";
    import { useStore } from "@/use/store/store";
    import AuthenticationManagement from "@/api/AuthenticationManagement";

    export default {
        components: {
            Modal,
        },
        setup() {
            const baseModal = ref();
            let checking = ref(false);
            let hasError = ref(false);
            let password = ref("");
            let loginResponseHandler: LoginResponseHandler = new LoginResponseHandler();

            enum action {
                CANCEL,
                CONFIRM,
            }

            async function show() {
                return await baseModal.value.show();
            }

            async function checkPassword() {
                checking.value = true;
                const store = useStore();
                const response = await AuthenticationManagement.login({
                    username: (await store.getters.user).username,
                    password: password.value,
                });
                if (loginResponseHandler.handleResponse(response)) {
                    close(action.CONFIRM);
                } else {
                    hasError.value = true;
                }
                checking.value = false;
            }

            function close(action: action) {
                password.value = "";
                hasError.value = false;
                baseModal.value.close(action);
            }

            return {
                hasError,
                checking,
                checkPassword,
                baseModal,
                password,
                show,
                close,
                action,
            };
        },
    };
</script>
