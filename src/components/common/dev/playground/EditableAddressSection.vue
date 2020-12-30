<template>
    <editable-section
        v-slot="{ isEditing }"
        title="Address"
        subtitle="Please keep your address information as up to date as possible. This is the address where official mail will be sent to."
        @cancel="onCancel()"
        @save="onSave()"
    >
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Country</label>
                    <Select v-model:elements="countries" v-model:selection="addressCopy.country" :disabled="!isEditing" />
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">City</label>
                    <input v-model="addressCopy.city" :readonly="!isEditing" type="text" class="w-full input-text-tmp" />
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Postal Code</label>
                    <input v-model="addressCopy.zipCode" :readonly="!isEditing" type="text" class="w-full input-text-tmp" />
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Street</label>
                    <input v-model="addressCopy.street" :readonly="!isEditing" type="text" class="w-full input-text-tmp" />
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">House Number</label>
                    <input v-model="addressCopy.houseNumber" :readonly="!isEditing" type="text" class="w-full input-text-tmp" />
                </div>
            </div>
        </div>
    </editable-section>
</template>

<script lang="ts">
    import EditableSection from "@/components/common/section/EditableSection.vue";
    import Select from "@/components/common/Select.vue";
    import { Country } from "@/entities/Country";
    import { ref } from "vue";
    import { cloneDeep } from "lodash";

    export default {
        name: "EditableAddressSection",
        components: {
            EditableSection,
            Select,
        },
        props: {
            address: {
                type: Object,
                required: true,
            },
        },
        emits: ["update:address"],
        setup(props: any, { emit }: any) {
            const countries = Object.values(Country).filter((e) => e !== Country.NONE);
            const addressCopy = ref(cloneDeep(props.address));

            function onCancel() {
                addressCopy.value = cloneDeep(props.address);
            }

            function onSave() {
                emit("update:address", addressCopy.value);
            }

            return {
                countries,
                addressCopy,
                onCancel,
                onSave,
            };
        },
    };
</script>
