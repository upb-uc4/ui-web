<template>
    <div class="w-full flex flex-col items-center">
        <label v-if="label != ''" class="w-full text-gray-700 text-sm font-medium mb-1">
            {{ label }}
            <span v-if="required" class="text-blue-700"> *</span>
        </label>
        <input
            ref="BaseInput"
            v-model="model"
            :type="type"
            :class="[isValid ? validClass : errClass]"
            :placeholder="placeholder || label"
            :disabled="disabled"
            :readonly="readonly"
            @blur="validate"
        />
        <div v-if="!isValid && !disabled" class="input-errors text-sm text-red-500 mt-1">
            {{ errorMessage || getDefaultErrorsMessage }}
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, onMounted, ref, watch } from "vue";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import { useStore } from "@/use/store/store";
    import ValidationBag from "@/use/helpers/ValidationBag";
    export default {
        name: "BaseInput",
        inheritAttrs: false,
        props: {
            label: {
                type: String,
                required: false,
                default: "",
            },
            validClass: {
                type: String,
                required: false,
                default: "",
            },
            errorClass: {
                type: String,
                required: false,
                default: "",
            },
            errorMessage: {
                type: String,
                required: false,
                default: "",
            },
            required: {
                type: Boolean,
                required: false,
                default: false,
            },
            placeholder: {
                type: String,
                required: false,
                default: "",
            },
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            readonly: {
                type: Boolean,
                required: false,
                default: false,
            },
            value: {
                type: String,
                required: true,
            },
            type: {
                default: "text",
                type: String,
            },
            validationQuery: {
                type: String,
                default: "",
            },
        },
        setup(props: any, { emit }: any) {
            let isValid = ref(true);
            let errClass = props.validClass + " " + props.errorClass;
            let validation = ref("");

            const model = useModelWrapper(props, emit, "value");

            onMounted(async () => {
                const store = useStore();
                const val = await store.getters.validation;
                const validationBag = new ValidationBag(val);

                if (props.validationQuery) {
                    validation.value = validationBag.get(props.validationQuery);
                }
            });

            const getDefaultErrorsMessage = computed(() => {
                if (props.label && props.required) {
                    return props.label + " is required.";
                }

                return "Value invalid.";
            });

            watch(model, (oldValue, newValue) => {
                if (oldValue !== newValue) {
                    validate();
                }
            });

            function validate() {
                let val = true;
                if (!props.disabled) {
                    if (val && props.required) {
                        val = val && props.value != null && props.value.length !== 0;
                    }

                    if (val && validation && props.value) {
                        const valueAsString = props.value.toString();
                        const match = valueAsString.match(validation.value);
                        val = val && match !== null && match[0] === valueAsString;
                    }
                }
                isValid.value = val;
                return isValid;
            }

            return {
                isValid,
                model,
                getDefaultErrorsMessage,
                validate,
                errClass,
                validation,
            };
        },
    };
</script>
