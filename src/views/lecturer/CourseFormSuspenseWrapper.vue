<template>
    <suspense>
        <template #default>
            <lecturer-create-course-form v-model:success="success" v-model:hasInput="hasInput" :edit-mode="editMode" />
            <unsaved-changes-modal ref="unsavedChangesModal" />
        </template>
        <template #fallback>
            <loading-component />
        </template>
    </suspense>
</template>

<script lang="ts">
    import LecturerCreateCourseForm from "./EditCreateCourseForm.vue";
    import LoadingComponent from "../../components/loading/Spinner.vue";
    import { checkPrivilege } from "@/use/PermissionHelper";
    import { Role } from "@/entities/Role";
    import { ref } from "vue";
    import UnsavedChangesModal from "@/components/modals/UnsavedChangesModal.vue";

    export default {
        name: "CourseFormSuspenseWrapper",
        components: {
            LecturerCreateCourseForm,
            LoadingComponent,
            UnsavedChangesModal,
        },

        async beforeRouteEnter(_to: any, _from: any, next: any) {
            const allowed = await checkPrivilege(Role.LECTURER);

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
