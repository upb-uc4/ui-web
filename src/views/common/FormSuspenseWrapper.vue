<template>
    <suspense>
        <template #default>
            <admin-create-account-form :editMode="editMode"/>
        </template>
        <template #fallback>
            Loading.....
        </template>
    </suspense>
</template>>

<script lang="ts">
import AdminCreateAccountForm from "../admin/EditCreateAccountForm.vue";
import { store } from '@/store/store';
import {Role} from '@/entities/Role'
import router from '../../router';


export default {
    name: "FormSuspenseWrapper",
    components: {
        AdminCreateAccountForm,
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

    beforeRouteEnter(_to: any, _from: any, next: any) {
		if(_to.path.includes("Account") && store.state.myRole == Role.ADMIN) {
            return next();
        }
        return next("/redirect");
	},
}
</script>>