<template>
    <div class="flex flex-row">
        <div class="mr-2 w-full flex flex-col">
            <label class="text-gray-700 text-sm">Day</label>
            <select v-model="shownDay" class="form-select input-select" @change="updateDay($event.target.value)">
                <option disabled :value="''"> Select a Day </option>
                <option v-for="selectableDay in 31" :key="selectableDay">{{ selectableDay }}</option>
            </select>
        </div>
        <div class="mx-2 w-full flex flex-col">
            <label class="text-gray-700 text-sm">Month </label>
            <select v-model="shownMonth" class="form-select input-select" @change="updateMonth($event.target.value)">
                <option disabled :value="''"> Select a Month </option>
                <option v-for="selectableMonth in months" :key="selectableMonth">{{ selectableMonth }}</option>
            </select>
        </div>
        <div class="ml-2 w-full flex flex-col">
            <label class="text-gray-700 text-sm">Year</label>
            <select v-model="shownYear" class="form-select input-select" @change="updateYear($event.target.value)">
                <option disabled :value="''"> Select a Year </option>
                <option v-for="selectableYear in selectableYears" :key="selectableYear">{{ selectableYear }}</option>
            </select>
        </div>
    </div>
</template>

<script lang="ts">
    import { Month } from "@/entities/Month";
    import { ref } from "vue";
    export default {
        name: "BirthDatePicker",
        props: {
            year: {
                type: String,
                required: true,
            },
            month: {
                type: String,
                required: true,
            },
            day: {
                type: String,
                required: true,
            },
        },
        emits: ["update:day", "update:month", "update:year"],
        setup(props: any, { emit }) {
            let months = Month;

            let shownDay: string = ref(props.day).value == "" ? "" : parseInt(ref(props.day).value).toString();
            let shownMonth: string = ref(props.month).value == "" ? "" : Object.values(Month)[parseInt(ref(props.month).value) - 1];
            let shownYear: string = ref(props.year).value;

            let currentYear = new Date().getFullYear();
            let selectableYears = [];
            for (let index = currentYear; index >= currentYear - 80; index--) {
                selectableYears.push(index);
            }

            function updateDay(day: string) {
                if (parseInt(day) < 10) {
                    day = "0" + day;
                }
                emit("update:day", day);
            }

            function updateMonth(month: string) {
                let monthIndex = Object.values(months).indexOf(month as Month) + 1;
                emit("update:month", monthIndex < 10 ? "0" + monthIndex : monthIndex.toString());
            }

            function updateYear(year: string) {
                emit("update:year", year.toString());
            }

            return {
                shownDay,
                shownMonth,
                shownYear,
                months,
                selectableYears,
                updateDay,
                updateMonth,
                updateYear,
            };
        },
    };
</script>
