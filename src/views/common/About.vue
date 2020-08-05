<template>
    <div class="flex flex-col items-center justify-center w-full mt-20">
        <h1 class="text-4xl font-semibold">This is <a class="text-blue-800">UC4</a>!</h1>
        <div class="flex flex-col items-center w-full mt-5">
            <section class="w-full py-8 border-t-2 border-gray-400">
                <div class="lg:flex">
                    <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                        <label class="block mb-2 text-xl text-gray-700">What is UC4?</label>
                    </div>
                    <div class="flex flex-col w-full lg:w-2/3">
                        <label class="mb-3 text-lg font-medium text-gray-700">
                            UC4 is short for 'University Credits 4.0'. It is an educational research project located at
                            <a
                                class="text-blue-700 hover:text-blue-800 hover:underline"
                                target="_blank"
                                href="https://cs.uni-paderborn.de/en/studies/degree-programs/computer-science/"
                            >
                                Paderborn University
                            </a>
                            . This software is a work in progress prototype of an university management system, that is based on a
                            blockchain to ensure privacy and data persistence. For further information about the vision of this project,
                            visit us on our
                            <a
                                class="text-blue-700 hover:text-blue-800 hover:underline"
                                target="_blank"
                                href="https://uc4.cs.uni-paderborn.de/"
                            >
                                website
                            </a>
                            .
                        </label>
                    </div>
                </div>
            </section>
            <section class="w-full py-8 border-t-2 border-gray-400">
                <div class="lg:flex">
                    <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                        <label class="block mb-2 text-xl text-gray-700">Who are we?</label>
                    </div>
                    <div class="flex flex-col w-full lg:w-2/3">
                        <label class="mb-3 text-lg font-medium text-gray-700">
                            We are 16 motivated students in the masters program of the computer science departement of Paderborn University.
                            Our group now works together on the realization of the vision of a user secure and reliable credit system for a
                            period of one year, starting in April 2020.
                        </label>
                    </div>
                </div>
            </section>
            <section class="w-full py-8 border-t-2 border-gray-400">
                <div class="lg:flex">
                    <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                        <label class="block mb-2 text-xl text-gray-700">Contacts</label>
                    </div>
                    <div class="flex flex-col w-full lg:w-2/3">
                        <label class="mb-3 text-lg font-medium text-gray-700">
                            Interested in our project? So lets get in touch! You can contact us over different channels:
                        </label>
                        <label class="mb-3 text-lg font-medium text-gray-700">
                            <a
                                class="text-blue-700 hover:text-blue-800 hover:underline"
                                target="_blank"
                                href="https://uc4.cs.uni-paderborn.de/"
                            >
                                <i class="mr-2 fas fa-globe"></i>
                                Website
                            </a>
                        </label>
                        <label class="mb-3 text-lg font-medium text-gray-700">
                            <a class="text-blue-700 hover:text-blue-800 hover:underline" target="_blank" href="https://github.com/upb-uc4">
                                <i class="mr-2 fab fa-github"></i>
                                GitHub
                            </a>
                        </label>
                        <label class="mb-3 text-lg font-medium text-gray-700">
                            <a
                                class="text-blue-700 hover:text-blue-800 hover:underline"
                                target="_blank"
                                href="https://twitter.com/Uc4_Official"
                            >
                                <i class="mr-2 fab fa-twitter"></i>
                                Twitter
                            </a>
                        </label>
                        <label class="mb-3 text-lg font-medium text-gray-700">
                            <a class="text-blue-700 hover:text-blue-800 hover:underline" target="_blank" href="mailto:uc4_official@web.de">
                                <i class="mr-2 fas fa-envelope"></i>
                                Email
                            </a>
                        </label>
                    </div>
                </div>
            </section>
            <section class="w-full py-8 border-t-2 border-gray-400">
                <div class="lg:flex">
                    <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                        <label class="block mb-2 text-xl text-gray-700">Work in Progress</label>
                    </div>
                    <div class="flex flex-col items-start w-full lg:w-2/3">
                        <label class="mb-3 text-lg font-medium text-gray-700">
                            In this project group, we are prototyping a university management system from scratch. Hence, this application
                            is work in progress. If you encounter any problems, you can contact us via the channels given above or report
                            them here.
                        </label>
                        <button
                            class="w-1/5 p-2 my-4 font-semibold text-gray-100 bg-blue-700 rounded-lg shadow-lg hover:bg-blue-800 text-md"
                            @click="reportProblem"
                        >
                            <i class="mr-2 fas fa-exclamation-triangle"></i>
                            Report problem
                        </button>
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
