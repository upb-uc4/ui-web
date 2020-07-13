<template>
    <suspense>
        <template #default>
            <admin-create-account-form v-if="isAdmin" :editMode="editMode"/>
            <lecturer-create-course-form v-if="isLecturer" :editMode="editMode"/>
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


export default {
    name: "FormSuspenseWrapper",
    components: {
        AdminCreateAccountForm,
        LecturerCreateCourseForm,
        LoadingComponent,
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

        return{
            isAdmin,
            isLecturer,
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
}
</script>>