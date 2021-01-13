<template>
    <loading-spinner v-if="busy" />
    <base-view v-else>
        <section-header title="Settings" />
        <appearance-section />
        <security-section />
        <certificate-section />
        <request-data-section />
        <button-section>
            <template #right>
                <button id="showAccountDeletionModal" class="btn-secondary-remove w-48" @click="showAccountDeletionModal()">
                    Delete Account
                </button>
            </template>
        </button-section>
    </base-view>
    <delete-own-account-modal ref="deleteOwnAccountModal" />
</template>

<script lang="ts">
    import Router from "@/use/router";
    import { Role } from "@/entities/Role";
    import { checkPrivilege } from "@/use/helpers/PermissionHelper";
    import BaseView from "@/views/common/BaseView.vue";
    import SectionHeader from "@/components/common/section/SectionHeader.vue";
    import AppearanceSection from "@/components/settings/AppearanceSection.vue";
    import SecuritySection from "@/components/settings/SecuritySection.vue";
    import CertificateSection from "@/components/settings/CertificateSection.vue";
    import RequestDataSection from "@/components/settings/RequestDataSection.vue";
    import ButtonSection from "@/components/common/section/ButtonSection.vue";
    import { ref } from "vue";
    import { useStore } from "@/use/store/store";
    import DeleteOwnAccountModal from "@/components/modals/DeleteOwnAccountModal.vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import UserManagement from "@/api/UserManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import { logout } from "@/use/helpers/Logout";

    export default {
        name: "Settings",
        components: {
            BaseView,
            ButtonSection,
            SectionHeader,
            SecuritySection,
            AppearanceSection,
            CertificateSection,
            RequestDataSection,
            DeleteOwnAccountModal,
            LoadingSpinner,
        },

        async beforeRouteEnter(_from: any, _to: any, next: any) {
            const response = await checkPrivilege(Role.LECTURER, Role.STUDENT, Role.ADMIN);

            if (response.allowed) {
                return next();
            }
            if (!response.authenticated) {
                return next("/login");
            }

            return next("/redirect");
        },

        setup() {
            const deleteOwnAccountModal = ref();
            const busy = ref(false);

            function back() {
                Router.back();
            }

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
                back,
                deleteOwnAccountModal,
                showAccountDeletionModal,
                busy,
            };
        },
    };
</script>
