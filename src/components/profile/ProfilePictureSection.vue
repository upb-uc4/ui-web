<template>
    <section class="py-8 border-t-2 border-gray-400">
        <div class="lg:flex">
            <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                <label class="block mb-2 text-lg font-medium text-gray-700">Profile Picture</label>
            </div>
            <div class="flex flex-col">
                <img class="h-48 w-48 object-cover mb-5 rounded-full border border-gray-500 block" :src="selectedPicture" />
                <input id="uploadFile" hidden type="file" accept="*.jpeg, *.png, *.jpg" @change="uploadPicture" />
                <div class="flex">
                    <button id="uploadPicture" class="btn btn-blue-primary w-48" @click="triggerFileUpload">Select Image</button>
                    <button
                        v-if="pictureChanged"
                        id="confirmPicture"
                        title="Confirm Profile Picture"
                        class="btn btn-icon-green ml-3 text-xl w-10"
                        @click="confirmPicture"
                    >
                        <i class="far fa-check"></i>
                    </button>
                    <button
                        v-if="pictureChanged"
                        id="resetPicture"
                        title="Reset Profile Picture"
                        class="btn btn-icon-red ml-3 text-xl w-10"
                        @click="resetPicture"
                    >
                        <i class="far fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { Role } from "@/entities/Role";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { computed, ref, watch } from "vue";
    import { cloneDeep } from "lodash";

    export default {
        name: "PrivateProfilePictureSection",
        props: {
            errorBag: {
                type: ErrorBag,
                required: true,
            },
            username: {
                type: String,
                required: true,
            },
        },

        setup(props: any, { emit }: any) {
            const selectedPicture = ref(props.picture);
            const fallbackPicture = cloneDeep(props.picture);

            const pictureChanged = computed(() => {
                const value = selectedPicture.value !== fallbackPicture;
                return value;
            });

            function triggerFileUpload() {
                (document.getElementById("uploadFile") as any).click();
            }

            function uploadPicture(e: Event) {
                const files: FileList | null = (e.target as HTMLInputElement)?.files;
                if (files == null) return;

                const file = files[0];
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    selectedPicture.value = e.target?.result;
                };
            }

            function resetPicture() {
                selectedPicture.value = fallbackPicture;
            }

            return {
                uploadPicture,
                selectedPicture,
                triggerFileUpload,
                resetPicture,
                pictureChanged,
            };
        },
    };
</script>
