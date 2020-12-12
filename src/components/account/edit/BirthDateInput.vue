<template>
    <div id="birthdate" class="flex space-x-6">
        <div class="w-1/3">
            <label class="input-label-tmp">Day</label>
            <selection :disabled="true" :elements="days" :default="selectedDay" @update:selected="onDayChanged" />
        </div>
        <div class="w-1/3">
            <label class="input-label-tmp">Month</label>
            <selection :disabled="true" :elements="months" :default="selectedMonth" @update:selected="onMonthChanged" />
        </div>
        <div class="w-1/3">
            <label class="input-label-tmp">Year</label>
            <selection :disabled="true" :elements="years" :default="selectedYear" @update:selected="onYearChanged" />
        </div>
    </div>
</template>

<script lang="ts">
    import { days, months } from "@/entities/Month";
    import Select from "@/components/common/Select";
    import { ref } from "vue";

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
            const selectedYear = ref();

            if (props.birthDate) {
                let dates = props.birthDate.split("-");
                let date = new Date(+dates[2], dates[1] - 1, +dates[0]);
                selectedDay.value = date.getDay().toString();
                selectedMonth.value = date.toLocaleString("en-GB", { month: "long" });
                selectedYear.value = date.getFullYear().toString();
            }

            function onDayChanged(day) {
                selectedDay.value = day;
                emitBirthdate();
            }

            function onMonthChanged(month) {
                //use hack to convert month to number, e.g. "January" to "1"
                selectedMonth.value = new Date(Date.parse(month + " 1, 2020")).getMonth() + 1;
                emitBirthdate();
            }

            function onYearChanged(year) {
                selectedYear.value = year;
                emitBirthdate();
            }

            function emitBirthdate() {
                console.log(selectedDay.value, selectedMonth.value, selectedYear.value);
                emit("update:birthDate", `${selectedDay.value}-${selectedMonth.value}-${selectedYear.value}`);
            }

            return {
                days,
                months,
                years,
                selectedDay,
                selectedMonth,
                selectedYear,
                onDayChanged,
                onMonthChanged,
                onYearChanged,
            };
        },
    };
</script>
