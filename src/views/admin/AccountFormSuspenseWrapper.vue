<template>
    <suspense>
        <template #default>
            <admin-create-account-form :editMode="editMode" v-model:success="success" v-model:hasInput="hasInput"/>
            <unsaved-changes-modal ref="unsavedChangesModal"/>
        </template>
        <template #fallback>
            <loading-component/>
        </template>
    </suspense>
</template>

<script lang="ts">
    import AdminCreateAccountForm from "./EditCreateAccountForm.vue";
    import LoadingComponent from "../../components/loading/Spinner.vue"
    import { store } from '@/store/store';
    import {Role} from '@/entities/Role'
    import { ref } from "vue"
    import UnsavedChangesModal from "@/components/modals/UnsavedChangesModal.vue";

    export default {
        name: "FormSuspenseWrapper",
        components: {
            AdminCreateAccountForm,
            LoadingComponent,
            UnsavedChangesModal,
        },
        props: {
            editMode: {
                type: Boolean,
                required: true,
            },
        },

        setup() {
            let success = ref(new Boolean());
            success.value = false;
            let hasInput = ref(new Boolean());
            hasInput.value = false;

            let unsavedChangesModal = ref();

            return{
                hasInput,
                success,
                unsavedChangesModal
            }
        },

        beforeRouteEnter(_to: any, _from: any, next: any) {
            if(store.state.myRole == Role.ADMIN) {
                return next();
            }
            return next("/redirect");
        },

        beforeRouteLeave (to: any, from: any, next: any) {
            if (this.success) {
                return next();
            }
            if (this.hasInput) {
                const modal = this.unsavedChangesModal;
                let action = modal.action;
                modal.show()
                    .then((response: typeof action) => {
                        switch(response) {
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
                    })
            } else {
                next(true);
           }
        }
    }
</script>>