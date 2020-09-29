<template>
    <section class="py-8 border-t-2 border-gray-400">
        <div class="lg:flex">
            <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                <label class="block mb-2 text-lg font-medium text-gray-700">Profile Picture</label>
            </div>
            <div class="flex flex-col">
                <img id="picture" class="h-48 w-48 object-cover mb-5 rounded-full border border-gray-500 block" :src="selectedPicture" />
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
                <p v-if="errorBag.hasNested('profilePicture')" class="error-message">
                    {{ errorBag.getNested("profilePicture") }}
                </p>
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
    import Router from "@/use/router/";

    export default {
        name: "ProfilePictureSection",

        setup(props: any, { emit }: any) {
            const username: string = Router.currentRoute.value.params.username as string;
            const selectedPicture = ref();
            let fileToUpload: File = {} as File;
            const fallbackPicture = ref();
            const busy = ref(false);
            const errorBag = ref(new ErrorBag());

            onBeforeMount(() => {
                getProfilePicture();
            });

            async function getProfilePicture() {
                busy.value = true;
                const userManagement = new UserManagement();
                const response = await userManagement.getProfilePicture(username);
                const handler = new GenericResponseHandler();
                const result = handler.handleResponse(response);

                if (result.arrayBuffer != undefined) {
                    const reader = new FileReader();
                    reader.readAsDataURL(result);
                    reader.onload = (e) => {
                        selectedPicture.value = e.target?.result;
                        fallbackPicture.value = selectedPicture.value;
                    };
                } else {
                    //TODO Show Toast
                    console.log("Error: Loading Profile Picture Failed");
                    selectedPicture.value = "";
                    fallbackPicture.value = selectedPicture.value;
                }
                busy.value = false;
            }

            const pictureChanged = computed(() => {
                const value = selectedPicture.value !== fallbackPicture.value;
                return value;
            });

            function triggerFileUpload() {
                (document.getElementById("uploadFile") as any).click();
            }

            function uploadPicture(e: Event) {
                const files: FileList | null = (e.target as HTMLInputElement)?.files;
                if (files == null) return;

                const file = files[0];
                fileToUpload = file;
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    selectedPicture.value = e.target?.result;
                };
            }

            async function confirmPicture() {
                busy.value = true;
                const userManagement = new UserManagement();
                const response = await userManagement.updateProfilePicture(username, fileToUpload);
                const handler = new ProfilePictureUpdateResponseHandler();
                const result = await handler.handleResponse(response);
                if (result) {
                    fallbackPicture.value = selectedPicture.value;
                    errorBag.value = new ErrorBag();
                } else {
                    errorBag.value = new ErrorBag(handler.errorList);
                    console.log("Error: Uploading profile picture failed!");
                }
                busy.value = false;
            }

            function resetPicture() {
                selectedPicture.value = fallbackPicture.value;
            }

            return {
                busy,
                uploadPicture,
                selectedPicture,
                triggerFileUpload,
                resetPicture,
                pictureChanged,
                confirmPicture,
                errorBag,
                fileToUpload,
            };
        },
    };
</script>
