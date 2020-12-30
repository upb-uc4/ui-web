<template>
    <base-view>
        <section-header title="Settings" />
        <appearance-section />
        <security-section />
        <certificate-section />
    </base-view>
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

    export default {
        name: "Settings",
        components: {
            BaseView,
            SectionHeader,
            SecuritySection,
            AppearanceSection,
            CertificateSection,
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
            function back() {
                Router.back();
            }
            return { back };
        },
    };
</script>
