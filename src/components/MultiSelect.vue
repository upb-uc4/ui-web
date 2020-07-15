<template>
    <div>
        <div class="w-full flex flex-row items-center" v-for="index in output.length" :key="index">
            <select class="w-4/5 mr-1 my-2 py-3 rounded-lg border-gray-400 text-gray-600 form-select" 
                v-model="output[index-1]"
                @change="addValue($event.target.value,index-1)"
            >
                <option disabled :value="''">{{placeholder}}</option>

                <!-- add selected option, because the computed "unchosenValues" will not contain it -->
                <option v-if="output[index-1] != ''">{{output[index-1]}}</option>

                <option v-for="field in unchosenValues" :key="field">{{ field }}</option>
            </select>
            <div class="w-1/6 items-center justify-center">
                <button v-if="output[index-1] != ''" @click="removeValue(index-1)" 
                title="Remove Selected Field Of Study"
                class="w-1/2 m-1 bg-gray-100 text-gray-700 hover:text-white hover:bg-red-800 hover:border-red-800 rounded-lg border border-gray-600"> 
                    <i class="inline far fa-trash-alt text-lg"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, ref } from 'vue';
    export default {
        name: "MultiSelect",
        props: {
            inputList: {
                type: Array,
                required: true
            },
            preSelection: {
                type: Array,
                required: true
            },
            placeholder: {
                type: String,
                required: true
            }
        },
        setup(props: any, {emit}) {
            let input = ref(props.inputList);
            let output = ref([] as string[]);
            output.value.push(...(props.preSelection as string[]));
            output.value.push("");

            let unchosenValues = computed(() => {
                return input.value.filter(f => !output.value.includes(f as string));
            })
            
            function addValue(value: any, index:number) {
                if (output.value.length-1 == index) {
                    output.value.push("")
                }
                output.value[index] = value;
                emit("changed", output)
            }

            function removeValue(index:number) {
                output.value.splice(index, 1)
                emit("changed", output)
            }

            return {
                unchosenValues,
                addValue,
                removeValue,
                output
            }
        }
    }
</script>
