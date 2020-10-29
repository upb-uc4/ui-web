<template>
    <div class="flex">
        <label>Something went wrong on our side. Please consider reporting this bug.</label>
        <button class="btn text-blue-700 bg-gray-100 px-1 py-1 text-sm hover:bg-gray-300" @click="reportProblem()">Report</button>
    </div>
</template>

<script lang="ts">
    import axios, { AxiosResponse } from "axios";
    import { onBeforeMount } from "vue";
    import { getVersions } from "@/use/helpers/Versions";

    export default {
        name: "ReportBugComponent",
        emits: ["close-toast"],
        setup(props: any, { emit }: any) {
            let versions: { name: String; version: String }[] = [];
            let template: String = "";
            let bugReportURL = "";
            const base = "https://github.com/upb-uc4/ui-web/issues/new?";
            const labels = "&labels=bug";
            const bodyBase = "&body=";

            onBeforeMount(async () => {
                createURL();
                updateVersions(await getVersions());
            });

            async function createURL() {
                const instance = axios.create({
                    baseURL: "https://raw.githubusercontent.com/upb-uc4/.github/master/.github/ISSUE_TEMPLATE/",
                    headers: {
                        "Accept": "*/*",
                        "Content-Type": "application/json;charset=UTF-8",
                    },
                });

                await instance.get("/bug_report.md").then((response: AxiosResponse) => {
                    template = response.data;
                    template = template.substring(template.indexOf("**Describe the bug**"));
                    template = template.replace(/ /g, "%20");
                    template = template.replace(/\n/g, "%0A");
                });
            }

            function updateVersions(emittedVersions: { name: String; version: String }[]) {
                let versionsBody = `**Versions%20(Do%20not%20change)**%0A`;
                emittedVersions.forEach((e) => {
                    versionsBody += "-%20" + e.name + ":%20" + e.version + "%0A";
                });
                versionsBody += "%0A";
                let body = bodyBase + versionsBody + template;
                bugReportURL = base + labels + body;
            }

            function reportProblem() {
                emit("close-toast");
                window.open(bugReportURL, "_blank", "noreferrer");
            }
            return { reportProblem };
        },
    };
</script>
