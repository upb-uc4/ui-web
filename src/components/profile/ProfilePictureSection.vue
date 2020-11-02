<template>
    <section class="py-8 border-t-2 border-gray-400">
        <div class="lg:flex">
            <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                <label class="block mb-2 text-lg font-medium text-gray-700">Profile Picture</label>
            </div>
            <div class="flex flex-col">
                <loading-spinner v-if="busy" class="object-cover mb-5 rounded-full" />
                <div v-else class="w-full flex justify-center sm:justify-start">
                    <img id="picture" class="h-48 w-48 object-cover mb-5 rounded-full border border-gray-500" :src="selectedPicture" />
                </div>

                <input id="uploadFile" hidden type="file" accept=".jpeg, .png, .jpg" @change="uploadPicture" />
                <div class="flex justify-center sm:justify-start ml-12 sm:ml-0">
                    <button id="uploadPicture" :disabled="busy" class="btn btn-blue-primary w-48" @click="triggerFileUpload">
                        Select Image
                    </button>
                    <button
                        v-if="!pictureChanged"
                        id="deletePicture"
                        :disabled="busy"
                        title="Delete Profile Picture"
                        class="btn btn-icon-red ml-3 text-xl w-10"
                        @click="confirmDeletePicture"
                    >
                        <i class="far fa-trash-alt"></i>
                    </button>
                    <div v-else class="flex">
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
                <p v-if="errorBag.hasNested('profilePicture')" class="error-message">
                    {{ errorBag.getNested("profilePicture") }}
                </p>
            </div>
        </div>
    </section>
    <delete-profile-picture-modal ref="deletePictureModal" />
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
    import DeleteProfilePictureModal from "@/components/modals/DeleteProfilePictureModal.vue";
    import { useStore } from "vuex";
    import { MutationTypes } from "@/use/store/mutation-types";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";

    export default {
        name: "ProfilePictureSection",
        components: {
            DeleteProfilePictureModal,
            LoadingSpinner,
        },

        props: {
            username: {
                type: String,
                required: true,
            },
        },

        setup(props: any, { emit }: any) {
            const store = useStore();

            const username: string = cloneDeep(props.username);
            const selectedPicture = ref();
            let fileToUpload: File = {} as File;
            const fallbackPicture = ref();
            const busy = ref(false);
            const errorBag = ref(new ErrorBag());
            const deletePictureModal = ref();

            onBeforeMount(async () => {
                await getProfilePicture();
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
                    selectedPicture.value = "";
                    fallbackPicture.value = selectedPicture.value;
                }
                busy.value = false;
            }

            const pictureChanged = computed(() => {
                return selectedPicture.value !== fallbackPicture.value;
            });

            function triggerFileUpload() {
                (document.getElementById("uploadFile") as any).click();
            }

            function uploadPicture(e: Event) {
                const files: FileList | null = (e.target as HTMLInputElement)?.files;
                if (files == null || files?.length == 0) return;

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
                    store.commit(MutationTypes.FORCE_UPDATE_PROFILE_PICTURE, true);
                    errorBag.value = new ErrorBag();
                } else {
                    errorBag.value = new ErrorBag(handler.errorList);
                }
                busy.value = false;
            }

            function resetPicture() {
                selectedPicture.value = fallbackPicture.value;
            }

            async function confirmDeletePicture() {
                let modal = deletePictureModal.value;
                let action = modal.action;
                modal.show().then((response: typeof action) => {
                    switch (response) {
                        case action.CANCEL: {
                            //do nothing
                            break;
                        }
                        case action.DELETE: {
                            deleteProfilePicture();
                            store.commit(MutationTypes.FORCE_UPDATE_PROFILE_PICTURE, true);
                            break;
                        }
                    }
                });
            }

            async function deleteProfilePicture() {
                busy.value = true;
                const userManagement = new UserManagement();
                const response = await userManagement.deleteProfilePicture(username);
                const handler = new GenericResponseHandler();
                const result = await handler.handleResponse(response);
                if (result) {
                    getProfilePicture();
                } else {
                    console.error("Picture Deletion Failed!");
                }
                busy.value = false;
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
                deletePictureModal,
                confirmDeletePicture,
            };
        },
    };
</script>
