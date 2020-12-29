<template>
    <section class="border-t-2 py-8 border-gray-200 dark:border-normalgray-700">
        <div class="md:flex">
            <div class="w-full lg:w-1/3 md:block xl:mr-32 mr-12 mb-4">
                <div class="flex items-baseline space-x-4">
                    <span class="block text-gray-800 dark:text-gray-300 text-lg font-medium mb-2">{{ title }}</span>
                    <button v-show="!isEditing" class="btn-tertiary-tmp" @click="edit">Edit</button>
                    <button v-show="isEditing" class="btn-tertiary-tmp" @click="save">Save</button>
                    <button v-show="isEditing" class="btn-tertiary-tmp" @click="cancel">Cancel</button>
                </div>
                <span class="block text-gray-500 text-sm">{{ subtitle }}</span>
            </div>
            <div class="w-full lg:w-2/3">
                <slot />
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { ref } from "vue";

    export default {
        name: "EditableSection",
        props: {
            title: {
                required: true,
                type: String,
            },
            subtitle: {
                required: true,
                type: String,
            },
        },
        emits: ["edit", "cancel", "save"],
        setup(props: any, { emit }: any) {
            const isEditing = ref(false);

            function edit() {
                isEditing.value = true;
                emit("edit");
            }

            function cancel() {
                isEditing.value = false;
                emit("cancel");
            }

            function save() {
                isEditing.value = false;
                emit("save");
            }

            return {
                isEditing,
                edit,
                cancel,
                save,
            };
        },
    };
</script>
