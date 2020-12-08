<template>
    <modal-no-teleport ref="baseModal" :action="action" @cancel="close(action.CANCEL)">
        <template #header>
            <p class="text-2xl font-semibold text-red-600">Delete Own Account</p>
        </template>
        <div v-if="busy" class="mx-auto">
            <loading-spinner />
        </div>
        <div v-else class="flex flex-col">
            <div class="my-2 w-full flex justify-center my-8">
                <div class="fa-stack fa-2x">
                    <i class="fas fa-circle fa-stack-2x text-red-200" />
                    <i class="fas fa-exclamation fa-stack-1x text-red-600" />
                </div>
            </div>
            <p>
                <span class="font-bold text-red-600">Warning!</span> You are about to delete your UC4 account. If you continue, all your
                stored data will be deleted and you will not be able to use the system any more.
            </p>
            <div class="mt-6 relative">
                <i
                    :class="[isPasswordVisible() ? 'fa-eye-slash' : 'fa-eye']"
                    class="fas absolute mt-4 mr-4 right-0 text-gray-500 cursor-pointer"
                    @click="togglePassword"
                />
                <input
                    id="enterPasswordForAccountDeletion"
                    v-model="password"
                    :type="passwordFieldType"
                    class="w-full form-input input-text"
                    :class="{ error: hasError }"
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
