<template>
    <div>
        <dev-nav-bar />
        <div class="mt-32 text-4xl text-center font-semibold text-gray-900">Available Accounts</div>
        <div class="mt-8 flex justify-center">
            <admin-account-list />
        </div>
    </div>
</template>

<script lang="ts">
    import { store } from "../../store/store";
    import { Role } from "../../entities/Role";
    import DevNavBar from "../../components/dev_components/DevNavBar.vue";
    import AdminAccountList from "../../components/AdminAccountList.vue";

    export default {
        name: "AdminHome",
        components: {
            DevNavBar,
            AdminAccountList,
        },

        beforeRouteEnter(_to: any, _from: any, next: any) {
            const myRole = store.state.myRole;
            if (myRole != Role.ADMIN) {
                return next("/redirect");
            }
            return next();
        },
    };
</script>
