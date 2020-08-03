<template>
    <div class="flex flex-row">
        <div class="flex flex-col w-full mr-2">
            <label class="text-sm text-gray-700">Day</label>
            <select id="day" v-model="shownDay" class="form-select input-select">
                <option disabled :value="''"> Select a Day </option>
                <option v-for="selectableDay in 31" :id="'day-' + selectableDay" :key="selectableDay">{{ selectableDay }}</option>
            </select>
        </div>
        <div class="flex flex-col w-full mx-2">
            <label class="text-sm text-gray-700">Month </label>
            <select id="month" v-model="shownMonth" class="form-select input-select">
                <option disabled :value="''"> Select a Month </option>
                <option v-for="selectableMonth in months" :id="'month-' + selectableMonth" :key="selectableMonth">{{
                    selectableMonth
                }}</option>
            </select>
        </div>
        <div class="flex flex-col w-full ml-2">
            <label class="text-sm text-gray-700">Year</label>
            <select id="year" v-model="shownYear" class="form-select input-select">
                <option disabled :value="''"> Select a Year </option>
                <option v-for="selectableYear in selectableYears" :id="'year-' + selectableYear" :key="selectableYear">{{
                    selectableYear
                }}</option>
            </select>
        </div>
    </div>
</template>

<script lang="ts">
    import { Month } from "@/entities/Month";
    import { ref, reactive, computed, watch } from "vue";
    export default {
        name: "BirthDatePicker",
        props: {
            birthdate: {
                type: String,
                required: true,
            },
        },
        emits: ["update:birthdate"],
        setup(props: any, { emit }: any) {
            let months = Month;
            let shownDay = ref("");
            let shownMonth = ref("");
            let shownYear = ref("");
            if (props.birthdate != "") {
                let dates = props.birthdate.split("-");
                shownDay.value = parseInt(dates[2]).toString();
                shownMonth.value = dates[1] == "" ? "" : Object.values(Month)[parseInt(dates[1]) - 1];
                shownYear.value = dates[0];
            }

            let currentYear = new Date().getFullYear();
            let selectableYears = [];
            for (let index = currentYear; index >= currentYear - 80; index--) {
                selectableYears.push(index);
            }

            watch([shownDay, shownMonth, shownYear], () => {
                let monthIndex = Object.values(months).indexOf(shownMonth.value as Month) + 1;
                let date: string =
                    shownYear.value +
                    "-" +
                    (monthIndex < 10 ? "0" + monthIndex : monthIndex.toString()) +
                    "-" +
                    (parseInt(shownDay.value) < 10 ? "0" + shownDay.value : shownDay.value);
                emit("update:birthdate", date);
            });

            return {
                shownDay,
                shownMonth,
                shownYear,
                months,
                selectableYears,
            };
        },
    };
</script>
