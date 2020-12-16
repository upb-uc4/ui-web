<template>
    <div id="birthdate" class="flex space-x-6">
        <div class="w-1/3">
            <label class="input-label-tmp">Day</label>
            <selection v-model:selection="selectedDay" :disabled="true" :elements="days" />
        </div>
        <div class="w-1/3">
            <label class="input-label-tmp">Month</label>
            <selection v-model:selection="selectedMonth" :disabled="true" :elements="months" />
        </div>
        <div class="w-1/3">
            <label class="input-label-tmp">Year</label>
            <selection v-model:selection="selectedYear" :disabled="true" :elements="years" />
        </div>
    </div>
</template>

<script lang="ts">
    import { days, months } from "@/entities/Month";
    import Select from "@/components/common/Select.vue";
    import { computed, ref, watch } from "vue";

    export default {
        name: "BirthDatePicker",
        components: {
            Selection: Select,
        },
        props: {
            birthDate: {
                type: String,
                required: true,
            },
        },
        emits: ["update:birthDate"],
        setup(props: any, { emit }: any) {
            let currentYear = new Date().getFullYear();
            let years: string[] = [];
            for (let year = currentYear; year >= currentYear - 80; year--) {
                years.push(String(year));
            }

            const selectedDay = ref();
            const selectedMonth = ref();
            const selectedMonthAsNumber = computed(() => new Date(Date.parse(selectedMonth.value + " 1, 2020")).getMonth() + 1);
            const selectedYear = ref();

            if (props.birthDate) {
                let dates = props.birthDate.split("-");
                let date = new Date(+dates[2], dates[1] - 1, +dates[0]);
                selectedDay.value = date.getDay().toString();
                selectedMonth.value = date.toLocaleString("en-GB", { month: "long" });
                selectedYear.value = date.getFullYear().toString();
            }

            watch([selectedDay, selectedMonth, selectedYear], ([day, month, year]) => {
                emitBirthdate();
            });

            function emitBirthdate() {
                console.log(selectedDay.value, selectedMonthAsNumber.value, selectedYear.value);
                emit("update:birthDate", `${selectedDay.value}-${selectedMonthAsNumber.value}-${selectedYear.value}`);
            }

            return {
                days,
                months,
                years,
                selectedDay,
                selectedMonth,
                selectedYear,
            };
        },
    };
</script>
