<template>
    <div class="flex flex-col items-center justify-center w-full mt-20">
        <h1 class="text-4xl font-semibold text-blue-800">University Credits 4.0</h1>
        <div class="flex flex-col items-center w-full mt-5">
            <section class="w-full py-8 border-t-2 border-gray-400">
                <div class="lg:flex">
                    <div class="flex flex-col w-full mb-4 lg:w-1/4 lg:block">
                        <label class="block mb-2 text-lg font-semibold text-gray-700">What is UC4?</label>
                    </div>
                    <div class="flex flex-col w-full lg:w-3/4">
                        <label class="mb-3 text-gray-700 text-lg leading-relaxed">
                            UC4 is short for 'University Credits 4.0' - an educational research project at the
                            <a
                                class="text-blue-700 hover:text-blue-800 hover:underline"
                                target="_blank"
                                href="https://cs.uni-paderborn.de/en/studies/degree-programs/computer-science/"
                            >
                                Paderborn University.
                            </a>
                            This software is a work in progress prototype of an university management system. It is based on cutting edge
                            blockchain technology to securely ensure privacy and data persistence. If you wish to learn more about us, our
                            vision or the technology we use, pay us a visit at
                            <a
                                class="text-blue-700 hover:text-blue-800 hover:underline"
                                target="_blank"
                                href="https://uc4.cs.uni-paderborn.de/"
                            >
                                uc4.cs.uni-paderborn.de.
                            </a>
                        </label>
                    </div>
                </div>
            </section>
            <section class="w-full py-8 border-t-2 border-gray-400">
                <div class="lg:flex">
                    <div class="flex flex-col w-full mb-4 lg:w-1/4 lg:block">
                        <label class="block mb-2 text-lg font-semibold text-gray-700">About us</label>
                    </div>
                    <div class="flex flex-col w-full lg:w-3/4">
                        <label class="mb-3 text-gray-700 text-lg leading-relaxed">
                            We are a group of passionate Master's students at the Paderborn University who work hard to make your everyday
                            life at campus more simple. Starting from April 2020 onwards, we will provide continuous support for this
                            project until Q2 2021.
                        </label>
                    </div>
                </div>
            </section>
            <section class="w-full py-8 border-t-2 border-gray-400">
                <div class="lg:flex">
                    <div class="flex flex-col w-full mb-4 lg:w-1/4 lg:block">
                        <label class="block mb-2 text-lg font-semibold text-gray-700">Get in touch</label>
                    </div>
                    <div class="flex flex-col w-full lg:w-3/4">
                        <label class="mb-6 text-gray-700 text-lg">
                            Did we spark your interest in our project? Let's get in touch! You can reach out to us on various channels.
                        </label>

                        <div class="flex flex-col md:flex-row justify-between">
                            <label class="mb-3 md:mb-0 text-lg font-medium text-gray-700">
                                <a
                                    class="text-blue-700 hover:text-blue-800 hover:underline"
                                    target="_blank"
                                    href="https://uc4.cs.uni-paderborn.de/"
                                >
                                    <i class="mr-2 fas fa-globe" />
                                    Website
                                </a>
                            </label>
                            <label class="mb-3 md:mb-0 text-lg font-medium text-gray-700">
                                <a
                                    class="text-blue-700 hover:text-blue-800 hover:underline"
                                    target="_blank"
                                    href="https://github.com/upb-uc4"
                                >
                                    <i class="mr-2 fab fa-github" />
                                    GitHub
                                </a>
                            </label>
                            <label class="mb-3 md:mb-0 text-lg font-medium text-gray-700">
                                <a
                                    class="text-blue-700 hover:text-blue-800 hover:underline"
                                    target="_blank"
                                    href="https://twitter.com/Uc4_Official"
                                >
                                    <i class="mr-2 fab fa-twitter" />
                                    Twitter
                                </a>
                            </label>
                            <label class="mb-0 text-lg font-medium text-gray-700">
                                <a
                                    class="text-blue-700 hover:text-blue-800 hover:underline"
                                    target="_blank"
                                    href="mailto:uc4_official@web.de"
                                >
                                    <i class="mr-2 fas fa-envelope"></i>
                                    Email
                                </a>
                            </label>
                        </div>
                    </div>
                </div>
            </section>
            <section class="w-full py-8 border-t-2 border-gray-400">
                <div class="lg:flex">
                    <div class="flex flex-col w-full mb-4 lg:w-1/4 lg:block">
                        <label class="block mb-2 text-lg font-semibold text-gray-700">Work in Progress</label>
                    </div>
                    <div class="flex flex-col items-start w-full lg:w-3/4">
                        <label class="text-gray-700 text-lg">
                            This application is still work in progress. If you encounter any problems, please do not hesitate to contact us.
                        </label>
                        <div class="flex justify-center w-full">
                            <button class="w-56 my-6 btn btn-blue-primary" @click="reportProblem">
                                <i class="mr-2 fas fa-exclamation-triangle" />
                                Report a problem
                            </button>
                        </div>

                        <versions @versions="updateVersions" />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script lang="ts">
    import Versions from "@/components/Versions.vue";
    import { reactive, computed, ref } from "vue";
    import axios, { AxiosResponse } from "axios";

    export default {
        components: {
            Versions,
        },
        async setup() {
            let versions: { name: String; version: String }[] = reactive([]);
            let template: String = "";
            let bugReportURL = ref("");
            const base = "https://github.com/upb-uc4/ui-web/issues/new?";
            const labels = "&labels=bug";
            const bodyBase = "&body=";
            const instance = axios.create({
                baseURL: "https://raw.githubusercontent.com/upb-uc4/.github/master/.github/ISSUE_TEMPLATE/",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json;charset=UTF-8",
                },
            });

            instance.get("/bug_report.md").then((response: AxiosResponse) => {
                template = response.data;
                template = template.substring(template.indexOf("**Describe the bug**"));
                template = template.replace(/ /g, "%20");
                template = template.replace(/\n/g, "%0A");
            });

            function updateVersions(emittedVersions: { name: string; version: string }[]) {
                let versionsBody = `**Versions%20(Do%20not%20change)**%0A`;
                emittedVersions.forEach((e) => {
                    versionsBody += "-%20" + e.name + ":%20" + e.version + "%0A";
                });
                versionsBody += "%0A";
                let body = bodyBase + versionsBody + template;
                bugReportURL.value = base + labels + body;
            }

            function reportProblem() {
                window.open(bugReportURL.value, "_blank");
            }
            return {
                updateVersions,
                reportProblem,
            };
        },
    };
</script>
