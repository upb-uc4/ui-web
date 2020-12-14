<template>
    <div class="flex flex-col">
        <label v-if="hasLabel" class="w-full text-gray-700 text-sm font-medium mb-1">
            {{ label }}
            <span v-if="required" class="text-blue-700"> *</span>
        </label>
        <input
            :id="identifier"
            ref="BaseInput"
            v-model="model"
            class="w-full input-text form-input"
            :type="type"
            :class="{ error: !isValid }"
            :placeholder="placeholder || label"
            :disabled="disabled"
            :readonly="readonly"
            @blur="validate"
        />
        <div v-if="!isValid && !disabled" class="error error-message text-sm">
            {{ errorMessage || errMessage || getDefaultErrorsMessage }}
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
        props: {
            label: {
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
            identifier: {
                type: String,
                required: true,
            },
        },
        setup(props: any, { emit }: any) {
            let isValid = ref(true);
            let errClass = props.validClass + " " + props.errorClass;
            let validation = ref("");
            const errMessage = ref("");
            const hasLabel = props.label !== "";

            const model = useModelWrapper(props, emit, "value");

            onMounted(async () => {
                const store = useStore();
                const val = await store.getters.validation;
                const validationBag = new ValidationBag(val);

                if (props.validationQuery) {
                    validation.value = validationBag.get(props.validationQuery + ".regex");
                    errMessage.value = validationBag.get(props.validationQuery + ".message");
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

            watch(
                () => props.errorMessage,
                () => {
                    if (props.errorMessage != "") isValid.value = false;
                }
            );

            function validate() {
                let val = true;
                if (!props.disabled) {
                    if (val && props.required) {
                        val = val && props.value != null && props.value.length !== 0;
                    }

                    if (val && validation) {
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
                hasLabel,
                model,
                getDefaultErrorsMessage,
                validate,
                errClass,
                errMessage,
                validation,
            };
        },
    };
</script>