<template>
    <suspense>
        <template #default>
            <admin-create-account-form v-if="isAdmin" :editMode="editMode" v-model:successComp="success" v-model:hasInputComp="hasInput"/>
            <lecturer-create-course-form v-if="isLecturer" :editMode="editMode"/>
            <unsaved-changes-modal ref="unsavedChangesModal"/>
        </template>
        <template #fallback>
            <loading-component/>
        </template>
    </suspense>
</template>>

<script lang="ts">
import AdminCreateAccountForm from "../admin/EditCreateAccountForm.vue";
import LecturerCreateCourseForm from "../lecturer/EditCreateCourseForm.vue";
import LoadingComponent from "../../components/LoadingComponent.vue"
import { store } from '@/store/store';
import {Role} from '@/entities/Role'
import router from '../../router';
import { ref } from "vue"
import UnsavedChangesModal from "@/components/modals/UnsavedChangesModal.vue";



export default {
    name: "FormSuspenseWrapper",
    components: {
        AdminCreateAccountForm,
        LecturerCreateCourseForm,
        LoadingComponent,
        UnsavedChangesModal,
    },
    props: {
        editMode: {
            type: Boolean,
            required: true,
        },
        desiredRole: {
            role: Role,
            required: true,
        }
    },

    setup(props) {
        const isAdmin:boolean = props.desiredRole == Role.ADMIN;
        const isLecturer:boolean = props.desiredRole == Role.LECTURER;

        let success = ref(new Boolean());
        success.value = false;
        let hasInput = ref(new Boolean());
        hasInput.value = false;

        let unsavedChangesModal = ref();

        return{
            hasInput,
            success,
            isAdmin,
            isLecturer,
            unsavedChangesModal
        }
    },

    beforeRouteEnter(_to: any, _from: any, next: any) {
		if(_to.path.includes("Account") && store.state.myRole == Role.ADMIN) {
            return next();
        }
        else if(_to.path.includes("Course") && store.state.myRole == Role.LECTURER) {
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