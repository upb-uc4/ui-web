<template>
    <modal ref="baseModal" :action="action" @cancel="close(action.CANCEL)">
        <template #header>
            <p class="text-2xl text-gray-900">Confirmation Needed</p>
        </template>
        <div class="flex flex-col">
            <p>You are about to change critical data! Please enter your password to continue.</p>
            <input
                v-model="password"
                :disabled="checking"
                type="password"
                class="w-full form-input input-text mt-3"
                :class="{ error: hasError }"
                placeholder="Password"
            />
        </div>
        <template #footer>
            <button id="unsavedChangesModalCancel" class="mr-10 btn-tertiary" @click="close(action.CANCEL)">Cancel</button>
            <button id="unsavedChangesModalConfirmLeave" class="w-24 py-2 px-2 btn btn-blue-primary" @click="checkPassword">
                Confirm
            </button>
        </template>
    </modal>
</template>

<script lang="ts">
    import Modal from "@/components/modals/Modal.vue";
    import UserManagement from "@/api/UserManagement";
    import { ref } from "vue";
    import LoginResponseHandler from "@/use/LoginResponseHandler";
    import { store } from "../../store/store";

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
                const userManagement: UserManagement = new UserManagement();
                const response = await userManagement.login({ username: store.state.loginData.username, password: password.value });
                if (loginResponseHandler.handleReponse(response)) {
                    password.value = "";
                    hasError.value = false;
                    close(action.CONFIRM);
                } else {
                    hasError.value = true;
                }
                checking.value = false;
            }

            function close(action: action) {
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
