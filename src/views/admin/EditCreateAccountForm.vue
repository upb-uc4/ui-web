<template>
    <base-view>
        <loading-spinner v-if="isLoading" />
        <div v-else>
            <section-header :title="title" />
            <profile-picture-section v-if="editMode" />
            <role-section v-if="!editMode" v-model:role="account.user.role" :error-bag="errorBag" />
            <personal-section
                v-model:first-name="account.user.firstName"
                v-model:last-name="account.user.lastName"
                v-model:birth-date="account.user.birthDate"
                :error-bag="errorBag"
            />
            <security-section
                v-model:username="account.user.username"
                v-model:government-id="account.governmentId"
                v-model:password="account.authUser.password"
                :edit-mode="editMode"
                :error-bag="errorBag"
            />
            <contact-section v-model:email="account.user.email" v-model:phone-number="account.user.phoneNumber" :error-bag="errorBag" />
            <address-section v-model:address="account.user.address" :error-bag="errorBag" />
            <research-section
                v-if="isLecturer"
                v-model:free-text="account.lecturer.freeText"
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
            <delete-account-modal ref="deleteModal" />
            <unsaved-changes-modal ref="unsavedChangesModal" />
            <button-section>
                <template #left>
                    <button
                        v-if="editMode"
                        id="deleteAccount"
                        type="button"
                        class="w-full sm:w-32 btn-secondary-remove-tmp"
                        @click="confirmDeleteAccount"
                    >
                        Delete
                    </button>
                </template>
                <template #right>
                    <button id="cancel" type="button" class="w-full sm:w-32 btn-secondary-tmp" @click="back">Cancel</button>
                    <button v-if="editMode" id="saveChanges" :disabled="!hasInput" class="w-full sm:w-48 btn-tmp" @click="updateAccount">
                        Save Changes
                    </button>
                    <button v-else id="createAccount" :disabled="!hasInput" class="w-full sm:w-48 btn-tmp" @click="createAccount">
                        Create Account
                    </button>
                </template>
            </button-section>
        </div>
    </base-view>
</template>

<script lang="ts">
    import DeleteAccountModal from "@/components/modals/DeleteAccountModal.vue";
    import RoleSection from "@/components/profile/RoleSection.vue";
    import StudentInformationSection from "@/components/profile/student/StudentInformationSection.vue";
    import UnsavedChangesModal from "@/components/modals/UnsavedChangesModal.vue";
    import ProfilePictureSection from "@/components/profile/ProfilePictureSection.vue";
    import SectionHeader from "@/components/common/section/SectionHeader.vue";
    import BaseView from "@/views/common/BaseView.vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import ButtonSection from "@/components/common/section/ButtonSection.vue";
    import AddressSection from "@/components/profile/AddressSection.vue";
    import PersonalSection from "@/components/profile/PersonalSection.vue";
    import ContactSection from "@/components/profile/ContactSection.vue";
    import SecuritySection from "@/components/profile/SecuritySection.vue";
    import ResearchSection from "@/components/profile/lecturer/ResearchSection.vue";

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
    import ErrorBag from "@/use/helpers/ErrorBag";
    import ValidationResponseHandler from "@/use/helpers/ValidationResponseHandler";
    import AccountValidationResponseHandler from "@/use/helpers/AccountValidationResponseHandler";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import { onBeforeRouteLeave } from "vue-router";
    import scrollToTopError from "@/use/helpers/TopError";
    import { useToast } from "@/toast";

    export default {
        name: "AdminCreateAccountForm",
        components: {
            SecuritySection,
            ContactSection,
            LoadingSpinner,
            ButtonSection,
            SectionHeader,
            BaseView,
            DeleteAccountModal,
            RoleSection,
            AddressSection,
            StudentInformationSection,
            ProfilePictureSection,
            UnsavedChangesModal,
            PersonalSection,
            ResearchSection,
        },
        props: {
            editMode: {
                type: Boolean,
                required: true,
            },
        },
        emits: ["update:has-input", "update:success"],
        setup(props: any, { emit, root }: any) {
            let isLoading = ref(false);
            let account = reactive({
                authUser: new Account(),
                user: new UserEntity(),
                admin: new AdminEntity(),
                student: new StudentEntity(),
                lecturer: new LecturerEntity(),
                governmentId: "",
            });
            let initialAccount = {
                authUser: new Account(),
                user: new UserEntity(),
                admin: new AdminEntity(),
                student: new StudentEntity(),
                lecturer: new LecturerEntity(),
                governmentId: "",
            };
            let title = props.editMode ? "Account Editing" : "Account Creation";
            let success = ref(false);
            let deleteModal = ref();
            let unsavedChangesModal = ref();

            const errorBag = ref(new ErrorBag());

            const toast = useToast();

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

            onBeforeMount(async () => {
                if (props.editMode) {
                    await getUser();
                }
            });

            async function getUser() {
                isLoading.value = true;
                const userManagement: UserManagement = new UserManagement();

                const response = await userManagement.getSpecificUser(Router.currentRoute.value.params.username as string);
                const genericResponseHandler = new GenericResponseHandler("user");
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
                isLoading.value = false;
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
                    account.student.matriculationId != initialAccount.student.matriculationId ||
                    //governmentId
                    account.governmentId != ""
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

                const response = await userManagement.createUser(account.governmentId, account.authUser, newUser);
                const handler = new AccountValidationResponseHandler("user");
                success.value = handler.handleResponse(response);
                emit("update:success", success.value);
                if (success.value) {
                    toast.success("Account '" + account.user.username + "' created.");
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
                const handler = new ValidationResponseHandler("user");
                success.value = handler.handleResponse(response);
                emit("update:success", success.value);

                if (success.value) {
                    toast.success("Account '" + account.user.username + "' updated.");
                    back();
                } else {
                    errorBag.value = new ErrorBag(handler.errorList);
                    await scrollToTopError(errorBag.value.errors);
                }
            }

            async function deleteAccount() {
                const userManagement: UserManagement = new UserManagement();

                const genericResponseHandler = new GenericResponseHandler("user");
                const response = await userManagement.deleteUser(account.user.username);
                const result = genericResponseHandler.handleResponse(response);

                if (result) {
                    success.value = true;
                    toast.success("Account '" + account.user.username + "' deleted.");
                    emit("update:success", success.value);
                    back();
                }
            }

            function back() {
                Router.push("/accounts");
            }

            return {
                isLoading,
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
