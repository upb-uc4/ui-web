<template>
    <modal-no-teleport ref="baseModal" :action="action" @cancel="close(action.CANCEL)">
        <template #header>
            <p class="text-2xl font-semibold text-red-700">Delete Own Account</p>
        </template>
        <div v-if="busy" class="mx-auto">
            <loading-spinner />
        </div>
        <div v-else class="flex flex-col w-full">
            <div class="my-2 w-full flex justify-center my-8">
                <div class="fa-stack fa-2x">
                    <i class="fas fa-circle fa-stack-2x text-red-200" />
                    <i class="fas fa-exclamation fa-stack-1x text-red-700" />
                </div>
            </div>
            <div class="flex flex-col">
                <p class="flex font-semibold input-label">
                    <span class="text-red-700 mr-2 mb-4 font-bold">Warning!</span>
                    You are about to delete your UC4 account.
                </p>
                <p class="text-sm font-semibold input-label">
                    If you continue, all your saved personal data will be permanently deleted and you will no will no longer be able to use
                    the system. Stored study data remains, but you may only access it by requesting it using your secret used for
                    enrollment.
                </p>
            </div>
            <div class="mt-6 relative">
                <i
                    :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']"
                    class="fas absolute z-20 mt-2.5 mr-4 right-0 text-gray-500 cursor-pointer"
                    @click="togglePassword"
                />
                <input
                    id="enterPasswordForAccountDeletion"
                    v-model="password"
                    :type="passwordFieldType"
                    class="w-full form-input input-text"
                    :class="hasError ? 'input-text-error' : ''"
                    placeholder="Enter Password"
                    @keypress.enter="checkPassword"
                />
            </div>
            <p v-if="hasError" class="error-message">Please enter the correct password.</p>
        </div>
        <template #footer>
            <button id="deleteOwnAccountModalCancel" class="mr-10 btn-tertiary" @click="close(action.CANCEL)">Cancel</button>
            <button
                id="deleteOwnAccountModalConfirm"
                :disabled="!valid"
                class="px-2 py-2 btn btn-red-primary"
                @click="close(action.CONFIRM)"
            >
                Confirm Deletion
            </button>
        </template>
    </modal-no-teleport>
</template>

<script lang="ts">
    import ModalNoTeleport from "@/components/modals/ModalNoTeleport.vue";
    import { computed, ref } from "vue";
    import AuthenticationManagement from "@/api/AuthenticationManagement";
    import LoginResponseHandler from "@/use/helpers/LoginResponseHandler";
    import { useStore } from "@/use/store/store";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";

    export default {
        components: {
            ModalNoTeleport,
            LoadingSpinner,
        },
        setup() {
            const busy = ref(false);
            const baseModal = ref();
            let hasError = ref(false);
            let password = ref("");
            let passwordFieldType = ref("password");
            let loginResponseHandler: LoginResponseHandler = new LoginResponseHandler();
            let valid = computed(() => password.value != "");

            enum action {
                CANCEL,
                CONFIRM,
            }

            function togglePassword() {
                passwordFieldType.value = isPasswordVisible() ? "password" : "text";
            }

            function isPasswordVisible() {
                return passwordFieldType.value === "text";
            }

            async function show() {
                password.value = "";
                return await baseModal.value.show();
            }

            async function checkPassword() {
                busy.value = true;
                const store = useStore();
                const response = await AuthenticationManagement._getRefreshToken({
                    username: (await store.getters.user).username,
                    password: password.value,
                });
                if (loginResponseHandler.handleResponse(response)) {
                    baseModal.value.close(action.CONFIRM);
                } else {
                    hasError.value = true;
                }
                busy.value = false;
            }

            async function close(a: action) {
                if (a == action.CANCEL) {
                    hasError.value = false;
                    baseModal.value.close(a);
                }
                if (a == action.CONFIRM) {
                    checkPassword();
                }
            }

            return {
                togglePassword,
                isPasswordVisible,
                passwordFieldType,
                hasError,
                checkPassword,
                baseModal,
                password,
                busy,
                show,
                close,
                action,
                valid,
            };
        },
    };
</script>
