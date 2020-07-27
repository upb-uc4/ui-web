<template>
    <suspense>
        <template #default>
            <admin-create-account-form v-model:success="success" v-model:hasInput="hasInput" :edit-mode="editMode" />
            <unsaved-changes-modal ref="unsavedChangesModal" />
        </template>
        <template #fallback>
            <loading-component />
        </template>
    </suspense>
</template>

<script lang="ts">
    import AdminCreateAccountForm from "./EditCreateAccountForm.vue";
    import LoadingComponent from "../../components/loading/Spinner.vue";
    import { Role } from "@/entities/Role";
    import { ref } from "vue";
    import { checkPrivilege } from "@/use/PermissionHelper";
    import UnsavedChangesModal from "@/components/modals/UnsavedChangesModal.vue";

    export default {
        name: "FormSuspenseWrapper",
        components: {
            AdminCreateAccountForm,
            LoadingComponent,
            UnsavedChangesModal,
        },

        async beforeRouteEnter(_to: any, _from: any, next: any) {
            const allowed = await checkPrivilege(Role.ADMIN);

            if (allowed) {
                return next();
            }
            return next("/redirect");
        },

        beforeRouteLeave(to: any, from: any, next: any) {
            if (this.success) {
                return next();
            }
            if (this.hasInput) {
                const modal = this.unsavedChangesModal;
                let action = modal.action;
                modal.show().then((response: typeof action) => {
                    switch (response) {
                        case action.CANCEL: {
                            next(false);
                            break;
                        }
                        case action.CONFIRM: {
                            next(true);
                            break;
                        }
                        default: {
                            next(true);
                        }
                    }
                });
            } else {
                next(true);
            }
        },
        props: {
            editMode: {
                type: Boolean,
                required: true,
            },
        },
        setup() {
            let success = ref(false);
            let hasInput = ref(false);
            let unsavedChangesModal = ref();

            return {
                hasInput,
                success,
                unsavedChangesModal,
            };
        },
    };
</script>
>
