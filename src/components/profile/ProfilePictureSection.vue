<template>
    <BaseSection title="Public Picture" subtitle="Click on the image to either delete your current profile picture or to set a new one.">
        <div class="w-32 h-32 relative text-center cursor-pointer">
            <input id="uploadFile" hidden type="file" accept=".jpeg, .png, .jpg" @change="openFileBrowser" />
            <div v-if="isLoading">
                <img src="@/assets/loading-spinner-alt.svg" alt="loading" />
            </div>
            <Menu v-else>
                <MenuButton id="profilePicture" class="focus:outline-none" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
                    <img id="picture" class="w-32 h-32 object-cover rounded-full" :src="selectedPicture" />
                    <div v-show="isHovered">
                        <div class="absolute top-0 left-0 w-32 h-32 rounded-full bg-black opacity-50" />
                        <div class="absolute top-24 left-0 w-full text-white text-sm font-medium tracking-wider">Change</div>
                    </div>
                </MenuButton>

                <transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-out"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                >
                    <MenuItems
                        class="absolute left-0 w-56 mt-2 origin-top-right input-base dark:border-normalgray-800 focus:border-blue-600 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                    >
                        <div class="py-1">
                            <MenuItem id="uploadPicture" v-slot="{ active }">
                                <span
                                    :class="
                                        active
                                            ? 'text-white bg-blue-600 font-semibold dark:text-gray-200'
                                            : 'text-gray-900 font-normal dark:text-gray-200'
                                    "
                                    class="flex justify-between w-full py-2 pl-8 pr-4 text-sm leading-5 text-left"
                                    @click="triggerOpenFileBrowser"
                                >
                                    Upload a photo
                                </span>
                            </MenuItem>
                            <MenuItem id="deletePicture" v-slot="{ active }">
                                <span
                                    :class="
                                        active
                                            ? 'text-white bg-blue-600 font-semibold dark:text-gray-200'
                                            : 'text-gray-900 font-normal dark:text-gray-200'
                                    "
                                    class="flex justify-between w-full py-2 pl-8 pr-4 text-sm leading-5 text-left"
                                    @click="confirmDeletePicture"
                                >
                                    Remove photo
                                </span>
                            </MenuItem>
                        </div>
                    </MenuItems>
                </transition>
            </Menu>
        </div>
        <delete-profile-picture-modal ref="deletePictureModal" />
    </BaseSection>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import { onBeforeMount, ref } from "vue";
    import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
    import Router from "@/use/router";
    import UserManagement from "@/api/UserManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import ProfilePictureUpdateResponseHandler from "@/use/helpers/ProfilePictureUpdateResponseHandler";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import DeleteProfilePictureModal from "@/components/modals/DeleteProfilePictureModal.vue";
    import { store, useStore } from "@/use/store/store";

    export default {
        name: "ProfilePictureSection",
        components: {
            Menu,
            MenuButton,
            MenuItems,
            MenuItem,
            DeleteProfilePictureModal,
            BaseSection,
        },
        props: {
            showOwnProfile: {
                type: Boolean,
                default: false,
            },
        },
        setup(props: any) {
            const store = useStore();
            let username: string = Router.currentRoute.value.params.username as string;

            const selectedPicture = ref();
            const fallbackPicture = ref();
            const isHovered = ref(false);
            const isLoading = ref(true);
            const errorBag = ref(new ErrorBag());
            const deletePictureModal = ref();
            let fileToUpload: File = {} as File;

            onBeforeMount(async () => {
                await getUsername();
                await getProfilePicture();
            });

            async function getUsername() {
                if (props.showOwnProfile) {
                    username = (await store.getters.user).username;
                }
            }

            async function getProfilePicture() {
                const userManagement = new UserManagement();
                const response = await userManagement.getProfilePicture(username);
                const handler = new GenericResponseHandler("profile picture");
                const result = handler.handleResponse(response);

                if (result.arrayBuffer !== undefined) {
                    const reader = new FileReader();
                    reader.readAsDataURL(result);
                    reader.onload = (e) => {
                        selectedPicture.value = e.target?.result;
                    };
                } else {
                    selectedPicture.value = "";
                }
                fallbackPicture.value = selectedPicture.value;
                isLoading.value = false;
            }

            function triggerOpenFileBrowser() {
                (document.getElementById("uploadFile") as any).click();
            }

            function openFileBrowser(e: Event) {
                const files: FileList | null = (e.target as HTMLInputElement)?.files;
                if (files == null || files?.length == 0) return;

                const file = files[0];
                fileToUpload = file;
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    selectedPicture.value = e.target?.result;
                    uploadPicture();
                };
            }

            async function uploadPicture() {
                isLoading.value = true;
                const userManagement = new UserManagement();
                const response = await userManagement.updateProfilePicture(username, fileToUpload);
                const handler = new ProfilePictureUpdateResponseHandler();
                const result = await handler.handleResponse(response);
                if (result) {
                    fallbackPicture.value = selectedPicture.value;
                    errorBag.value = new ErrorBag();
                } else {
                    errorBag.value = new ErrorBag(handler.errorList);
                }
                isLoading.value = false;
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
                            deletePicture();
                            break;
                        }
                    }
                });
            }

            async function deletePicture() {
                isLoading.value = true;
                const userManagement = new UserManagement();
                const response = await userManagement.deleteProfilePicture(username);
                const handler = new GenericResponseHandler("profile picture");
                const result = await handler.handleResponse(response);
                if (result) {
                    await getProfilePicture();
                }
                isLoading.value = false;
            }

            return {
                selectedPicture,
                isLoading,
                isHovered,
                deletePictureModal,
                confirmDeletePicture,
                openFileBrowser,
                triggerOpenFileBrowser,
            };
        },
    };
</script>
