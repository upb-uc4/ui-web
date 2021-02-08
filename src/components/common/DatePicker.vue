<template>
    <div id="date" class="flex space-x-6">
        <div class="w-1/3">
            <selection :id="'day'" v-model:selection="selectedDay" :disabled="disabled" :elements="days" placeholder="Day" />
        </div>
        <div class="w-1/3">
            <selection :id="'month'" v-model:selection="selectedMonth" :disabled="disabled" :elements="months" placeholder="Month" />
        </div>
        <div class="w-1/3">
            <selection :id="'year'" v-model:selection="selectedYear" :disabled="disabled" :elements="years" placeholder="Year" />
        </div>
    </div>
</template>

<script lang="ts">
    import { days, months } from "@/entities/Month";
    import Select from "@/components/common/Select.vue";
    import { computed, ref, watch } from "vue";

    export default {
        name: "DatePicker",
        components: {
            Selection: Select,
        },
        props: {
            date: {
                type: String,
                required: true,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
        },
        emits: ["update:date"],
        setup(props: any, { emit }: any) {
            let currentYear = new Date().getFullYear();
            let years: string[] = [];
            for (let year = currentYear; year >= currentYear - 80; year--) {
                years.push(String(year));
            }

            const selectedDay = ref("");
            const selectedMonth = ref("");
            const selectedMonthAsNumber = computed(() => new Date(Date.parse(selectedMonth.value + " 1, 2020")).getMonth() + 1);
            const selectedYear = ref("");

            const zeroPad = (text: any, places: number) => String(text).padStart(places, "0");

            if (props.date) {
                let dates = props.date.split("-");
                let date = new Date(+dates[0], dates[1] - 1, +dates[2]);
                selectedDay.value = date.getDay().toString();
                selectedMonth.value = date.toLocaleString("en-GB", { month: "long" });
                selectedYear.value = date.getFullYear().toString();
            }

            watch([selectedDay, selectedMonth, selectedYear], ([day, month, year]) => {
                emit("update:date", `${selectedYear.value}-${zeroPad(selectedMonthAsNumber.value, 2)}-${zeroPad(selectedDay.value, 2)}`);
            });

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
