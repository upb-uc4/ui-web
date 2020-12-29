<template>
    <editable-section title="Contact" subtitle="How can we reach you?" @edit="onEdit()" @cancel="onCancel()" @save="onSave()">
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Email</label>
                    <input v-model="emailCopy" :readonly="!isEditing" type="text" class="w-full input-text-tmp" />
                </div>
                <div class="lg:w-1/2 w-full" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Phone</label>
                    <input v-model="phoneNumberCopy" :readonly="!isEditing" type="text" class="w-full input-text-tmp" />
                </div>
                <div class="lg:w-1/2 w-full" />
            </div>
        </div>
    </editable-section>
</template>

<script lang="ts">
    import { ref } from "vue";
    import { cloneDeep } from "lodash";
    import EditableSection from "@/components/common/section/EditableSection.vue";

    export default {
        name: "EditableContactSection",
        components: {
            EditableSection,
        },
        props: {
            phoneNumber: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
        },
        emits: ["update:email", "update:phoneNumber"],
        setup(props: any, { emit }: any) {
            const isEditing = ref(false);
            const phoneNumberCopy = ref(cloneDeep(props.phoneNumber));
            const emailCopy = ref(cloneDeep(props.email));

            function onEdit() {
                isEditing.value = true;
            }

            function onCancel() {
                isEditing.value = false;
                phoneNumberCopy.value = cloneDeep(props.phoneNumber);
                emailCopy.value = cloneDeep(props.email);
            }

            function onSave() {
                isEditing.value = false;
                emit("update:email", emailCopy);
                emit("update:phoneNumber", phoneNumberCopy);
            }

            return {
                phoneNumberCopy,
                emailCopy,
                onEdit,
                onCancel,
                onSave,
                isEditing,
            };
        },
    };
</script>
