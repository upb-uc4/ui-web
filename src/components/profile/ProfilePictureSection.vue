<template>
    <section class="py-8 border-t-2 border-gray-400">
        <div class="lg:flex">
            <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                <label class="block mb-2 text-lg font-medium text-gray-700">Profile Picture</label>
            </div>
            <div class="flex flex-col">
                <img class="h-48 w-48 object-cover mb-5 rounded-full border border-gray-500 block" :src="selectedPicture" />
                <input id="uploadFile" hidden type="file" accept=".jpeg, .png, .jpg" @change="uploadPicture" />
                <div class="flex">
                    <button id="uploadPicture" :disabled="busy" class="btn btn-blue-primary w-48" @click="triggerFileUpload">
                        Select Image
                    </button>
                    <button
                        v-if="pictureChanged"
                        id="confirmPicture"
                        :disabled="busy"
                        title="Confirm Profile Picture"
                        class="btn btn-icon-green ml-3 text-xl w-10"
                        @click="confirmPicture"
                    >
                        <i class="fas fa-check"></i>
                    </button>
                    <button
                        v-if="pictureChanged"
                        id="resetPicture"
                        :disabled="busy"
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
    import { computed, onBeforeMount, ref, watch } from "vue";
    import { cloneDeep } from "lodash";
    import UserManagement from "@/api/UserManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import ProfilePictureUpdateResponseHandler from "@/use/helpers/ProfilePictureUpdateResponseHandler";

    export default {
        name: "PrivateProfilePictureSection",
        props: {
            username: {
                type: String,
                required: true,
            },
        },

        setup(props: any, { emit }: any) {
            const selectedPicture = ref();
            let fallbackPicture: any;
            const busy = ref(false);

            onBeforeMount(() => {
                getProfilePicture();
            });

            async function getProfilePicture() {
                busy.value = true;
                const userManagement = new UserManagement();
                const response = await userManagement.getProfilePicture(props.username);
                const handler = new GenericResponseHandler();
                const result = handler.handleReponse(response);
                if (result.arrayBuffer != undefined) {
                    selectedPicture.value = result;
                    fallbackPicture = selectedPicture.value;
                } else {
                    //TODO Show Toast
                    console.log("Error: Loading Profile Picture Failed");
                    selectedPicture.value = "";
                    fallbackPicture = selectedPicture.value;
                }
                busy.value = false;
            }

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

            async function confirmPicture() {
                busy.value = true;
                const userManagement = new UserManagement();
                const response = await userManagement.updateProfilePicture(props.username, selectedPicture.value);
                const handler = new ProfilePictureUpdateResponseHandler();
                const result = await handler.handleReponse(response);
                if (result) {
                    fallbackPicture = selectedPicture.value;
                } else {
                    console.log("Error: Uploading profile picture failed!");
                }
                busy.value = false;
            }

            function resetPicture() {
                selectedPicture.value = fallbackPicture;
            }

            return {
                busy,
                uploadPicture,
                selectedPicture,
                triggerFileUpload,
                resetPicture,
                pictureChanged,
                confirmPicture,
            };
        },
    };
</script>
