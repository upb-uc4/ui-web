<template>
    <div class="w-full h-screen mx-auto mt-8 bg-gray-300 lg:mt-20">
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
                v-model:password="account.authUser.password"
                :edit-mode="editMode"
                :error-bag="errorBag"
            />
            <personal-information-section
                v-model:first-name="account.user.firstName"
                v-model:last-name="account.user.lastName"
                v-model:birthday-day="account.birthDate.day"
                v-model:birthday-month="account.birthDate.month"
                v-model:birthday-year="account.birthDate.year"
                v-model:country="account.user.address.country"
                v-model:street="account.user.address.street"
                v-model:house-number="account.user.address.houseNumber"
                v-model:zip-code="account.user.address.zipCode"
                v-model:city="account.user.address.city"
                :edit-mode="editMode"
                :error-bag="errorBag"
            />
            <lecturer-information-section
                v-if="isLecturer"
                v-model:free-text="account.lecturer.freeText"
                v-model:research-area="account.lecturer.researchArea"
                :edit-mode="editMode"
                :error-bag="errorBag"
            />
            <student-information-section
                v-if="isStudent"
                v-model:immatriculation-status="account.student.immatriculationStatus"
                v-model:matriculation-id="account.student.matriculationId"
                v-model:selected-fields-of-study="account.student.fieldsOfStudy"
                v-model:semester-count="account.student.semesterCount"
                :edit-mode="editMode"
                :error-bag="errorBag"
            />
            <section class="py-8 border-t-2 border-gray-400" :hidden="!editMode">
                <div class="lg:flex">
                    <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                        <label class="block mb-2 text-lg font-medium text-gray-700">Profile Picture</label>
                        <label class="block text-gray-600">
                            Change the Profile Picture
                        </label>
                    </div>
                    <div class="flex flex-col items-center justify-center">
                        <img class="object-contain h-48" :src="account.user.picture" />
                        <button
                            id="updatePicture"
                            class="px-4 py-2 font-semibold text-blue-700 bg-transparent border border-2 border-blue-700 rounded-lg hover:bg-blue-800 hover:text-white hover:border-transparent"
                            @click="updatePicture"
                        >
                            Update Profile Picture
                        </button>
                    </div>
                </div>
            </section>
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
                        <button id="cancel" type="button" class="w-32 mr-6 btn btn-blue-secondary" @click="back">
                            Cancel
                        </button>
                        <button
                            v-if="editMode"
                            id="saveChanges"
                            :disabled="!hasInput"
                            class="w-48 w-full btn btn-blue-primary"
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
                    <button id="mobileCancel" type="button" class="w-full mb-4 btn btn-blue-secondary" @click="back">
                        Cancel
                    </button>
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
                        id="mobleCreateAccount"
                        :disabled="!hasInput"
                        class="w-full mb-4 btn btn-blue-primary"
                        @click="createAccount"
                    >
                        Create Account
                    </button>
                    <button id="mobileDeleteAccount" class="w-full btn btn-red-secondary" @click="confirmDeleteAccount">
                        Delete
                    </button>
                </div>
            </section>
            <delete-account-modal ref="deleteModal" />
        </div>
    </div>
</template>

<script lang="ts">
    import Router from "@/router/";
    import { Role } from "@/entities/Role";
    import { ref, reactive, computed } from "vue";
    import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";
    import UserManagement from "@/api/UserManagement";
    import StudentEntity from "@/entities/StudentEntity";
    import UserEntity from "@/entities/UserEntity";
    import LecturerEntity from "@/entities/LecturerEntity";
    import AdminEntity from "@/entities/AdminEntity";
    import { Account } from "@/entities/Account";
    import Admin from "../../api/api_models/user_management/Admin";
    import Student from "../../api/api_models/user_management/Student";
    import Lecturer from "../../api/api_models/user_management/Lecturer";
    import DeleteAccountModal from "@/components/modals/DeleteAccountModal.vue";
    import { Country } from "@/entities/Country";
    import ErrorBag from "@/use/ErrorBag";
    import ValidationResponseHandler from "../../use/ValidationResponseHandler";
    import GenericResponseHandler from "@/use/GenericResponseHandler";
    import BirthDatePicker from "@/components/BirthDatePicker.vue";
    import RoleSection from "@/components/account/edit/RoleSection.vue";
    import UserSecuritySection from "@/components/account/edit/UserSecuritySection.vue";
    import PersonalInformationSection from "@/components/account/edit/PersonalInformationSection.vue";
    import LecturerInformationSection from "@/components/account/edit/LecturerInformationSection.vue";
    import StudentInformationSection from "@/components/account/edit/StudentInformationSection.vue";

    export default {
        name: "AdminCreateAccountForm",
        components: {
            DeleteAccountModal,
            RoleSection,
            UserSecuritySection,
            PersonalInformationSection,
            LecturerInformationSection,
            StudentInformationSection,
        },
        props: {
            editMode: {
                type: Boolean,
                required: true,
            },
        },
        async setup(props: any, { emit }) {
            let account = reactive({
                authUser: new Account(),
                user: new UserEntity(),
                admin: new AdminEntity(false),
                student: new StudentEntity(false),
                lecturer: new LecturerEntity(false),
                birthDate: {
                    day: "",
                    month: "",
                    year: "",
                },
            });
            let initialAccount = {
                authUser: new Account(),
                user: new UserEntity(),
                admin: new AdminEntity(false),
                student: new StudentEntity(false),
                lecturer: new LecturerEntity(false),
                birthDate: {
                    day: "",
                    month: "",
                    year: "",
                },
            };

            let title = props.editMode ? "Account Editing" : "Account Creation";
            let success = ref(false);
            let deleteModal = ref();

            const errorBag: ErrorBag = reactive(new ErrorBag());

            let isLecturer = computed(() => {
                return account.user.role === Role.LECTURER;
            });

            let isStudent = computed(() => {
                return account.user.role === Role.STUDENT;
            });

            if (props.editMode) {
                const userManagement: UserManagement = new UserManagement();

                const response = await userManagement.getSpecificUser(Router.currentRoute.value.params.username as string);
                const genericResponseHandler = new GenericResponseHandler();
                const result = genericResponseHandler.handleReponse(response);

                //TODO move this to a non-generic response handler
                if (response.statusCode !== 200) {
                    alert("User not found");
                } else {
                    account.user = result;
                    initialAccount.user = JSON.parse(JSON.stringify(account.user));
                    let dates = result.birthDate.split("-");
                    account.birthDate.day = initialAccount.birthDate.day = dates[2];
                    account.birthDate.month = initialAccount.birthDate.month = dates[1];
                    account.birthDate.year = initialAccount.birthDate.year = dates[0];

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
            }

            function updatePicture() {
                console.log(account);
                console.log(initialAccount);
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
                    //default user birthdate from the form
                    account.birthDate.day != initialAccount.birthDate.day ||
                    account.birthDate.month != initialAccount.birthDate.month ||
                    account.birthDate.year != initialAccount.birthDate.year ||
                    //default user address
                    account.user.address.country != initialAccount.user.address.country ||
                    account.user.address.street != initialAccount.user.address.street ||
                    account.user.address.houseNumber != initialAccount.user.address.houseNumber ||
                    account.user.address.zipCode != initialAccount.user.address.zipCode ||
                    account.user.address.city != initialAccount.user.address.city ||
                    account.user.picture != initialAccount.user.picture ||
                    //lecturer properties
                    account.lecturer.freeText != initialAccount.lecturer.freeText ||
                    account.lecturer.researchArea != initialAccount.lecturer.researchArea ||
                    //student properties
                    account.student.immatriculationStatus != initialAccount.student.immatriculationStatus ||
                    account.student.matriculationId != initialAccount.student.matriculationId ||
                    account.student.semesterCount != initialAccount.student.semesterCount
                ) {
                    emit("update:hasInput", true);
                    return true;
                }

                //check whether a field of study has been added or removed
                for (let field of account.student.fieldsOfStudy) {
                    if (!initialAccount.student.fieldsOfStudy.includes(field)) {
                        emit("update:hasInput", true);
                        return true;
                    }
                }

                for (let field of initialAccount.student.fieldsOfStudy) {
                    if (!account.student.fieldsOfStudy.includes(field)) {
                        emit("update:hasInput", true);
                        return true;
                    }
                }
                emit("update:hasInput", false);
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
                        if ("fieldsOfStudy" in newUser) {
                            newUser.fieldsOfStudy = newUser.fieldsOfStudy.filter((field) => field != FieldOfStudy.NONE);
                        }
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
                account.user.birthDate = account.birthDate.year + "-" + account.birthDate.month + "-" + account.birthDate.day;

                var newUser: Student | Lecturer | Admin = assembleAccount();

                const response = await userManagement.createUser(account.authUser, newUser);
                const handler = new ValidationResponseHandler();
                success.value = handler.handleReponse(response);
                emit("update:success", success.value);
                console.log(account);
                if (success.value) {
                    back();
                } else {
                    errorBag.replaceAllWith(handler.errorList);
                    //TODO: change the following line?
                    this.$forceUpdate();
                }
            }

            async function updateAccount() {
                const userManagement: UserManagement = new UserManagement();
                account.user.birthDate = account.birthDate.year + "-" + account.birthDate.month + "-" + account.birthDate.day;
                var adaptedUser: Student | Lecturer | Admin = assembleAccount();

                const response = await userManagement.updateUser(adaptedUser);
                const handler = new ValidationResponseHandler();
                success.value = handler.handleReponse(response);
                emit("update:success", success.value);

                if (success.value) {
                    back();
                } else {
                    errorBag.replaceAllWith(handler.errorList);
                    //TODO: change the following line?
                    this.$forceUpdate();
                }
            }

            async function deleteAccount() {
                const userManagement: UserManagement = new UserManagement();

                const genericResponseHandler = new GenericResponseHandler();
                const response = await userManagement.deleteUser(account.user.username);
                const result = genericResponseHandler.handleReponse(response);

                if (result) {
                    success.value = true;
                    emit("update:success", success.value);
                    back();
                }
            }

            function back() {
                Router.back();
            }

            return {
                title,
                account,
                success,
                updatePicture,
                isLecturer,
                isStudent,
                hasInput,
                back,
                createAccount,
                updateAccount,
                deleteAccount,
                confirmDeleteAccount,
                deleteModal,
                errorBag: errorBag,
            };
        },
    };
</script>
