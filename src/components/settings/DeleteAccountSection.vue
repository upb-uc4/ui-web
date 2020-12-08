<template>
    <section class="border-t-2 py-8 mt-5 border-red-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <div class="flex mb-2 align-baseline">
                    <label class="block text-red-600 text-lg font-medium">Account Deletion</label>
                </div>
                <label class="block text-red-600"> Delete your account and get all stored data deleted. </label>
            </div>
            <div v-if="busy">
                <loading-spinner />
            </div>
            <div v-else class="w-full lg:w-2/3">
                <button
                    id="showAccountDeletionModal"
                    class="btn text-white btn-red-primary bg-red-500 border-red-500 w-48"
                    @click="showAccountDeletionModal()"
                >
                    Delete Account
                </button>
            </div>
        </div>
    </section>
    <delete-own-account-modal ref="deleteOwnAccountModal" />
</template>

<script lang="ts">
    import { onBeforeMount, ref } from "vue";
    import { useStore } from "@/use/store/store";
    import DeleteOwnAccountModal from "@/components/modals/DeleteOwnAccountModal.vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import UserManagement from "@/api/UserManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import { logout } from "@/use/helpers/Logout";

    export default {
        name: "CertificateSection",
        components: { DeleteOwnAccountModal, LoadingSpinner },
        setup() {
            const deleteOwnAccountModal = ref();
            const busy = ref(false);
            function showAccountDeletionModal() {
                let modal = deleteOwnAccountModal.value;
                let action = modal.action;
                modal.show().then((response: typeof action) => {
                    switch (response) {
                        case action.CANCEL: {
                            //do nothing
                            break;
                        }
                        case action.CONFIRM: {
                            deleteAccount();
                            break;
                        }
                    }
                });
            }

            async function deleteAccount() {
                busy.value = true;
                const userManagement = new UserManagement();
                const handler = new GenericResponseHandler("account deletion");
                const store = useStore();
                const response = await userManagement.deleteUser((await store.getters.user).username);
                const result = handler.handleResponse(response);
                if (result) {
                    logout();
                }
                busy.value = false;
            }
            return {
                deleteOwnAccountModal,
                showAccountDeletionModal,
                busy,
            };
        },
    };
</script>
