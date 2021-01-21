<template>
    <base-view class="max-w-screen-lg mx-auto space-y-8">
        <h1 class="text-2xl font-medium text-gray-800 dark:text-gray-300 text-center">About Us</h1>
        <hr class="my-4 dark:border-normalgray-700" />
        <div class="lg:flex w-full space-y-8 lg:space-y-0">
            <div class="lg:w-1/5">
                <div class="mb-4">
                    <div class="text-gray-800 dark:text-gray-300 text-sm font-medium">University Credits 4.0</div>
                    <div class="text-gray-500 text-sm">Paderborn, Germany</div>
                </div>
                <div class="flex space-x-4">
                    <div class="flex items-center space-x-1">
                        <a class="text-gray-400 hover:text-gray-600" target="_blank" rel="noreferrer" href="https://github.com/upb-uc4">
                            <i class="fab fa-github text-3xl" />
                        </a>
                    </div>
                    <div class="flex items-center space-x-1">
                        <a
                            class="text-gray-400 hover:text-gray-600"
                            target="_blank"
                            rel="noreferrer"
                            href="https://twitter.com/Uc4_Official"
                        >
                            <i class="fab fa-twitter text-3xl" />
                        </a>
                    </div>

                    <div class="flex items-center space-x-1">
                        <a class="text-gray-400 hover:text-gray-600" target="_blank" rel="noreferrer" href="mailto:uc4_official@web.de">
                            <i class="fas fa-envelope text-3xl" />
                        </a>
                    </div>
                </div>
            </div>
            <div class="lg:w-4/5 space-y-8">
                <div>
                    <div class="w-full mb-6 text-justify">
                        <h2 class="block text-gray-800 dark:text-gray-300 text-lg font-medium mb-1">Research Project Group</h2>
                        <h3 class="block text-gray-600 dark:text-gray-500 text-sm leading-relaxed">
                            University Credits 4.0 is an educational research project at the
                            <a
                                class="navigation-link"
                                target="_blank"
                                rel="noreferrer"
                                href="https://cs.uni-paderborn.de/en/studies/degree-programs/computer-science/"
                            >
                                Paderborn University</a>. This software is a work in progress prototype of an university management system. It is based on cutting edge
                            blockchain technology to securely ensure privacy and data persistence. If you wish to learn more about us, our
                            vision or the technology we use, pay us a visit at
                            <a class="navigation-link" target="_blank" rel="noreferrer" href="https://uc4.cs.uni-paderborn.de/">
                                uc4.cs.uni-paderborn.de</a>. Starting from April 2020 onwards, continuous support for this project will be provided until Q2 2021.
                        </h3>
                    </div>
                </div>
                <div class="space-y-6">
                    <div class="w-full text-justify">
                        <h2 class="block text-gray-800 dark:text-gray-300 text-lg font-medium mb-1">Demo Login</h2>
                        <h3 class="block text-gray-600 dark:text-gray-500 text-sm leading-relaxed">
                            We encourage you to explore our product on your own. Feel free to use any of the following login combinations.
                            However, please <span class="font-semibold dark:text-gray-400">do not delete any of these accounts</span>. Each
                            of the provided accounts has a different access level which in turn unlocks certain features.
                        </h3>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <credential-card title="Administrator" emoji="👑" username="admin" password="admin" />
                        <credential-card title="Lecturer" emoji="👨‍🏫" username="lecturer" password="lecturer" />
                        <credential-card title="Student" emoji="👨‍🎓" username="student" password="student" />
                    </div>

                    <h3 class="block text-gray-600 dark:text-gray-500 text-sm leading-relaxed">
                        While we try to provide you with the best user experience possible, it may happen that you find something not
                        working as you would expect it. In this case we kindly ask you to
                        <a :href="githubIssueURL" class="navigation-link">create an issue on our GitHub repository</a> and let us know about
                        it so we can solve the problem in upcoming versions.
                    </h3>
                </div>
                <div>
                    <service-status-section />
                </div>
                <div class="w-full text-justify pb-8">
                    <h2 class="block text-gray-800 dark:text-gray-300 text-lg font-medium mb-1">Data Protection</h2>
                    <h3 class="block text-gray-600 dark:text-gray-500 text-sm leading-relaxed">
                        You can see our data protection agreement
                        <router-link class="navigation-link cursor-pointer hover:underline" :to="{ name: 'dpa' }">here</router-link>
                        .
                    </h3>
                </div>
            </div>
        </div>
    </base-view>
</template>

<script lang="ts">
    import CredentialCard from "@/components/common/dev/about/CredentialCard.vue";
    import ServiceStatusSection from "@/components/common/dev/about/ServiceStatusSection.vue";
    import { generatePrefilledGithubIssueURL } from "@/use/helpers/Versions.ts";
    import { ref, onBeforeMount } from "vue";
    import BaseView from "@/views/common/BaseView.vue";

    export default {
        components: {
            BaseView,
            CredentialCard,
            ServiceStatusSection,
        },
        setup() {
            const githubIssueURL = ref("https://github.com/upb-uc4/ui-web/issues/new?assignees=&labels=bug&template=bug_report.md&title=");

            onBeforeMount(() => {
                generatePrefilledGithubIssueURL().then((url: string) => (githubIssueURL.value = url));
            });

            return {
                githubIssueURL,
            };
        },
    };
</script>
