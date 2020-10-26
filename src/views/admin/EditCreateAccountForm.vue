<template>
    <div v-if="busy" class="flex h-screen">
        <div class="m-auto">
            <loading-component />
        </div>
    </div>
    <div v-else class="w-full h-screen mx-auto mt-8 bg-gray-300 lg:mt-20">
        <button id="navigateBack" class="flex items-center mb-4 navigation-link" @click="back()">
            <i class="text-xl fas fa-chevron-left"></i>
            <span class="ml-1 text-sm font-bold">Back</span>
        </button>

        <h1 class="mb-8 text-2xl font-medium text-gray-700">{{ title }}</h1>

        <div>
            <role-section v-model:role="account.user.role" :edit-mode="editMode" :error-bag="errorBag" />
            <user-security-section
                v-model:username="account.user.username"
                v-model:email="account.user.email"
                v-model:phonenumber="account.user.phoneNumber"
                v-model:password="account.authUser.password"
                :edit-mode="editMode"
                :error-bag="errorBag"
            />
            <personal-information-section
                v-model:first-name="account.user.firstName"
                v-model:last-name="account.user.lastName"
                v-model:birth-date="account.user.birthDate"
                :edit-mode="editMode"
                :error-bag="errorBag"
            />
            <address-section v-model:address="account.user.address" :error-bag="errorBag" />
            <lecturer-information-section
                v-if="isLecturer"
                v-model:description="account.lecturer.freeText"
                v-model:research-area="account.lecturer.researchArea"
                :edit-mode="editMode"
                :error-bag="errorBag"
            />
            <student-information-section
                v-if="isStudent"
                v-model:matriculation-id="account.student.matriculationId"
                :edit-mode="editMode"
                :error-bag="errorBag"
                :username="account.user.username"
                :latest="account.student.latestImmatriculation"
            />
            <profile-picture-section v-if="editMode" />
            <section class="py-8 border-t-2 border-gray-400 lg:mt-8">
                <div class="justify-between hidden sm:flex">
                    <div class="flex items-center justify-start">
                        <button
                            v-if="editMode"
                            id="deleteAccount"
                            type="button"
                            class="w-32 btn btn-red-secondary"
                            @click="confirmDeleteAccount"
                        >
                            Delete
                        </button>
                    </div>

                    <div class="flex items-center justify-end">
                        <button id="cancel" type="button" class="w-32 mr-6 btn btn-blue-secondary" @click="back">Cancel</button>
                        <button
                            v-if="editMode"
                            id="saveChanges"
                            :disabled="!hasInput"
                            class="w-full btn btn-blue-primary"
                            @click="updateAccount"
                        >
                            Save Changes
                        </button>
                        <button v-else id="createAccount" :disabled="!hasInput" class="w-48 btn btn-blue-primary" @click="createAccount">
                            Create Account
                        </button>
                    </div>
                </div>

                <!-- different button layout for mobile -->
                <div class="sm:hidden">
                    <button id="mobileCancel" type="button" class="w-full mb-4 btn btn-blue-secondary" @click="back">Cancel</button>
                    <button
                        v-if="editMode"
                        id="mobileSaveChanges"
                        :disabled="!hasInput"
                        type="button"
                        class="w-full mb-4 btn btn-blue-primary"
                        @click="updateAccount"
                    >
                        Save Changes
                    </button>
                    <button
                        v-else
                        id="mobileCreateAccount"
                        :disabled="!hasInput"
                        class="w-full btn btn-blue-primary"
                        @click="createAccount"
                    >
                        Create Account
                    </button>
                    <button v-if="editMode" id="mobileDeleteAccount" class="w-full btn btn-red-secondary" @click="confirmDeleteAccount">
                        Delete
                    </button>
                </div>
            </section>
            <delete-account-modal ref="deleteModal" />
            <unsaved-changes-modal ref="unsavedChangesModal" />
        </div>
    </div>
</template>

<script lang="ts">
    import Router from "@/use/router/";
    import { Role } from "@/entities/Role";
    import { ref, reactive, computed, onBeforeMount } from "vue";
    import UserManagement from "@/api/UserManagement";
    import StudentEntity from "@/entities/StudentEntity";
    import UserEntity from "@/entities/UserEntity";
    import LecturerEntity from "@/entities/LecturerEntity";
    import AdminEntity from "@/entities/AdminEntity";
    import { Account } from "@/entities/Account";
    import Admin from "@/api/api_models/user_management/Admin";
    import Student from "@/api/api_models/user_management/Student";
    import Lecturer from "@/api/api_models/user_management/Lecturer";
    import DeleteAccountModal from "@/components/modals/DeleteAccountModal.vue";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import ValidationResponseHandler from "@/use/helpers/ValidationResponseHandler";
    import AccountValidationResponseHandler from "@/use/helpers/AccountValidationResponseHandler";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import RoleSection from "@/components/account/edit/sections/RoleSection.vue";
    import UserSecuritySection from "@/components/account/edit/sections/UserSecuritySection.vue";
    import PersonalInformationSection from "@/components/account/edit/sections/PersonalInformationSection.vue";
    import AddressSection from "@/components/account/edit/sections/AddressSection.vue";
    import LecturerInformationSection from "@/components/account/edit/sections/LecturerInformationSection.vue";
    import StudentInformationSection from "@/components/account/edit/sections/StudentInformationSection.vue";
    import LoadingComponent from "@/components/common/loading/Spinner.vue";
    import UnsavedChangesModal from "@/components/modals/UnsavedChangesModal.vue";
    import { onBeforeRouteLeave } from "vue-router";
    import scrollToTopError from "@/use/helpers/TopError";
    import ProfilePictureSection from "@/components/account/edit/sections/ProfilePictureSection.vue";

    export default {
        name: "AdminCreateAccountForm",
        components: {
            DeleteAccountModal,
            RoleSection,
            UserSecuritySection,
            PersonalInformationSection,
            AddressSection,
            LecturerInformationSection,
            StudentInformationSection,
            ProfilePictureSection,
            UnsavedChangesModal,
            LoadingComponent,
        },
        props: {
            editMode: {
                type: Boolean,
                required: true,
            },
        },
        emits: ["update:has-input", "update:success"],
        setup(props: any, { emit, root }: any) {
            let busy = ref(false);
            let account = reactive({
                authUser: new Account(),
                user: new UserEntity(),
                admin: new AdminEntity(),
                student: new StudentEntity(),
                lecturer: new LecturerEntity(),
            });
            let initialAccount = {
                authUser: new Account(),
                user: new UserEntity(),
                admin: new AdminEntity(),
                student: new StudentEntity(),
                lecturer: new LecturerEntity(),
            };
            let title = props.editMode ? "Account Editing" : "Account Creation";
            let success = ref(false);
            let deleteModal = ref();
            let unsavedChangesModal = ref();

            const errorBag = ref(new ErrorBag());

            let isLecturer = computed(() => {
                return account.user.role === Role.LECTURER;
            });

            let isStudent = computed(() => {
                return account.user.role === Role.STUDENT;
            });

            onBeforeRouteLeave(async (to, from, next) => {
                if (success.value) {
                    return next();
                }
                if (hasInput.value) {
                    const modal = unsavedChangesModal.value;
                    let action = modal.action;
                    const response = await modal.show();
                    switch (response) {
                        case action.CANCEL: {
                            next(false);
                            break;
                        }
                        case action.CONFIRM: {
                            next(true);
                            break;
                        }
                        default: {
                            next(true);
                        }
                    }
                } else {
                    next(true);
                }
            });

            onBeforeMount(() => {
                if (props.editMode) {
                    getUser();
                }
            });

            async function getUser() {
                busy.value = true;
                const userManagement: UserManagement = new UserManagement();

                const response = await userManagement.getSpecificUser(Router.currentRoute.value.params.username as string);
                const genericResponseHandler = new GenericResponseHandler();
                const result = genericResponseHandler.handleResponse(response);

                //TODO move this to a non-generic response handler
                if (response.statusCode !== 200) {
                    alert("User not found");
                } else {
                    account.user = result;
                    initialAccount.user = JSON.parse(JSON.stringify(account.user));
                    if (result.role == Role.LECTURER) {
                        account.lecturer = result as Lecturer;
                        initialAccount.lecturer = JSON.parse(JSON.stringify(account.lecturer));
                    } else if (result.role == Role.STUDENT) {
                        account.student = result as Student;
                        initialAccount.student = JSON.parse(JSON.stringify(account.student));
                    } else if (result.role == Role.ADMIN) {
                        account.admin = result as Admin;
                        initialAccount.admin = JSON.parse(JSON.stringify(account.admin));
                    }
                }
                busy.value = false;
            }

            let hasInput = computed(() => {
                if (
                    //Role and password can only be set during account creation
                    (!props.editMode && account.user.role != Role.NONE) ||
                    (!props.editMode && account.authUser.password != "") ||
                    //default user names
                    account.user.username != initialAccount.user.username ||
                    account.user.firstName != initialAccount.user.firstName ||
                    account.user.lastName != initialAccount.user.lastName ||
                    account.user.email != initialAccount.user.email ||
                    account.user.phoneNumber != initialAccount.user.phoneNumber ||
                    //default user birthdate from the form
                    account.user.birthDate != initialAccount.user.birthDate ||
                    //default user address
                    account.user.address.country != initialAccount.user.address.country ||
                    account.user.address.street != initialAccount.user.address.street ||
                    account.user.address.houseNumber != initialAccount.user.address.houseNumber ||
                    account.user.address.zipCode != initialAccount.user.address.zipCode ||
                    account.user.address.city != initialAccount.user.address.city ||
                    //lecturer properties
                    account.lecturer.freeText != initialAccount.lecturer.freeText ||
                    account.lecturer.researchArea != initialAccount.lecturer.researchArea ||
                    //student properties
                    account.student.matriculationId != initialAccount.student.matriculationId
                ) {
                    emit("update:has-input", true);
                    return true;
                }
                emit("update:has-input", false);
                return false;
            });

            async function confirmDeleteAccount() {
                let modal = deleteModal.value;
                let action = modal.action;
                modal.show().then((response: typeof action) => {
                    switch (response) {
                        case action.CANCEL: {
                            //do nothing
                            break;
                        }
                        case action.DELETE: {
                            deleteAccount();
                            break;
                        }
                    }
                });
            }

            function assembleAccount(): Student | Lecturer | Admin {
                var newUser: Student | Lecturer | Admin = {} as Student;
                switch (account.user.role) {
                    case Role.ADMIN: {
                        newUser = {
                            ...account.admin,
                            ...account.user,
                        };
                        break;
                    }
                    case Role.STUDENT: {
                        newUser = {
                            ...account.student,
                            ...account.user,
                        } as Student;
                        break;
                    }
                    case Role.LECTURER: {
                        newUser = {
                            ...account.lecturer,
                            ...account.user,
                        };
                        break;
                    }
                }

                return newUser;
            }

            async function createAccount() {
                const userManagement: UserManagement = new UserManagement();
                account.authUser.username = account.user.username;
                account.authUser.role = account.user.role;

                var newUser: Student | Lecturer | Admin = assembleAccount();
                if (newUser.role == undefined) {
                    errorBag.value = new ErrorBag([{ name: "role", reason: "You have to select a role!" }]);
                    await scrollToTopError(errorBag.value.errors);
                    return;
                }

                const response = await userManagement.createUser(account.authUser, newUser);
                const handler = new AccountValidationResponseHandler();
                success.value = handler.handleResponse(response);
                emit("update:success", success.value);
                if (success.value) {
                    back();
                } else {
                    errorBag.value = new ErrorBag(handler.errorList);
                    await scrollToTopError(errorBag.value.errors);
                }
            }

            async function updateAccount() {
                const userManagement: UserManagement = new UserManagement();
                var adaptedUser: Student | Lecturer | Admin = assembleAccount();

                const response = await userManagement.updateUser(adaptedUser);
                const handler = new ValidationResponseHandler();
                success.value = handler.handleResponse(response);
                emit("update:success", success.value);

                if (success.value) {
                    back();
                } else {
                    errorBag.value = new ErrorBag(handler.errorList);
                    await scrollToTopError(errorBag.value.errors);
                }
            }

            async function deleteAccount() {
                const userManagement: UserManagement = new UserManagement();

                const genericResponseHandler = new GenericResponseHandler();
                const response = await userManagement.deleteUser(account.user.username);
                const result = genericResponseHandler.handleResponse(response);

                if (result) {
                    success.value = true;
                    emit("update:success", success.value);
                    back();
                }
            }

            function back() {
                Router.push("/accounts");
            }

            return {
                busy,
                title,
                account,
                success,
                isLecturer,
                isStudent,
                hasInput,
                back,
                createAccount,
                updateAccount,
                deleteAccount,
                confirmDeleteAccount,
                deleteModal,
                unsavedChangesModal,
                errorBag: errorBag,
            };
        },
    };
</script>
