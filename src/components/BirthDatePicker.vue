<template>
    <div class="flex flex-row ">
        <div class="mr-2 w-full flex flex-col">
            <label class="text-gray-700 text-sm">Day</label>
            <select class="py-3 rounded-lg border-gray-400 text-gray-600 form-select" 
                @change="updateDay($event.target.value)"
                >
                <option selected disabled> Select a Day </option>
                <option v-for="day in 31" :key="day">{{ day }}</option>
            </select>
        </div>
        <div class="mx-2 w-full flex flex-col">
            <label class="text-gray-700 text-sm">Month  </label>
            <select class="py-3 rounded-lg border-gray-400 text-gray-600 form-select" 
                @change="updateMonth($event.target.value)"
                >
                <option selected disabled> Select a Month </option>
                <option v-for="month in months" :key="month">{{ month }}</option>
            </select>
        </div>
        <div class="ml-2 w-full flex flex-col">
            <label class="text-gray-700 text-sm">Year</label>
            <select class="py-3 rounded-lg border-gray-400 text-gray-600 form-select" 
                @change="updateYear($event.target.value)"
                >
                <option selected disabled> Select a Year </option>
                <option v-for="year in selectableYears" :key="year">{{ year }}</option>
            </select>
        </div>
    </div>
</template>

<script lang="ts">
    import { Month } from "@/entities/Month"
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


        setup(props:any, { emit } ) {
            let months = Month;
            let currentYear = new Date().getFullYear();
            let selectableYears = [];

            for (let index = currentYear; index >= currentYear-80; index--) {
                selectableYears.push(index);
            }

            function updateDay(day:string) {
               if( parseInt(day) < 10 ) {
                   day = "0" + day;
               }
               emit("update:day",day);
            }

            function updateMonth(month:string) {
                let monthIndex = Object.values(months).indexOf(month as Month) + 1;
                emit("update:month", monthIndex < 10 ? "0" + monthIndex : monthIndex.toString());
            }

            function updateYear(year:string) {
                emit("update:year", year.toString());
            }

            return {
                months,
                selectableYears,
                updateDay,
                updateMonth,
                updateYear
            }
        }
    }
</script>