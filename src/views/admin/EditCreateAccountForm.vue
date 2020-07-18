<template>
    <div class="w-full lg:mt-20 mt-8 bg-gray-300 mx-auto h-screen">
        <button class="flex items-center mb-4 navigation-link" @click="back()">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Back</span>
        </button>

        <h1 class="text-2xl font-medium text-gray-700 mb-8">{{ title }}</h1>

        <div>
            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Select a Role</label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="mb-4 flex flex-col">
                            <div class="w-full flex">
                                <div v-for="role in roles" :key="role" class="mr-4 mb-3">
                                    <label class="flex items-center">
                                        <input
                                            v-model="account.user.role"
                                            type="radio"
                                            class="form-radio radio"
                                            name="role"
                                            :disabled="editMode"
                                            :value="role"
                                        />
                                        <span class="ml-2 text-gray-700 text-md font-medium">{{ role }}</span>
                                    </label>
                                </div>
                            </div>
                            <p v-if="errorBag.has('role')" class="error-message">{{ errorBag.get("role") }} bla</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">User Security</label>
                        <label class="block text-gray-600">
                            Basic Information of the User for Authentication
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Username</label>
                            <input
                                id="userName"
                                v-model="account.user.username"
                                type="text"
                                name="Username"
                                class="w-full form-input input-text"
                                :class="{ error: errorBag.has('username') }"
                                placeholder="Username"
                                :readonly="editMode"
                            />
                            <p v-if="errorBag.has('username')" class="error-message">{{ errorBag.get("username") }}</p>
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Email</label>
                            <input
                                id="email"
                                v-model="account.user.email"
                                type="text"
                                name="email"
                                class="w-full form-input input-text"
                                :class="{ error: errorBag.has('email') }"
                                placeholder="example@mail.com"
                            />
                            <p v-if="errorBag.has('email')" class="error-message">{{ errorBag.get("email") }}</p>
                        </div>
                        <div v-if="!editMode" class="mb-4 flex flex-col">
                            <label for="password" class="text-gray-700 text-md font-medium mb-3">
                                Password
                            </label>
                            <input
                                id="password"
                                v-model="account.authUser.password"
                                type="text"
                                name="password"
                                class="w-full form-input input-text"
                                :class="{ error: errorBag.has('password') }"
                                placeholder="Password"
                            />
                            <p v-if="errorBag.has('password')" class="error-message">{{ errorBag.get("password") }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Personal Information</label>
                        <label class="block text-gray-600">
                            Personal Information and Contact Data for the User
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">
                                Name
                            </label>
                            <div class="flex flex-row">
                                <div class="w-full pr-2 flex-col">
                                    <label class="text-gray-700 text-sm">Firstname</label>
                                    <input
                                        id="firstName"
                                        v-model="account.user.firstName"
                                        type="text"
                                        name="firstName"
                                        class="w-full form-input input-text"
                                        :class="{ error: errorBag.has('firstName') }"
                                        placeholder="Firstname"
                                    />
                                    <p v-if="errorBag.has('firstName')" class="error-message">
                                        {{ errorBag.get("firstName") }}
                                    </p>
                                </div>
                                <div class="w-full pl-2 flex-col">
                                    <label class="text-gray-700 text-sm">Lastname</label>
                                    <input
                                        id="lastName"
                                        v-model="account.user.lastName"
                                        type="text"
                                        name="lastName"
                                        class="w-full form-input input-text"
                                        :class="{ error: errorBag.has('lastName') }"
                                        placeholder="Lastname"
                                    />
                                    <p v-if="errorBag.has('lastName')" class="error-message">
                                        {{ errorBag.get("lastName") }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">
                                Birthdate
                            </label>
                            <birth-date-picker
                                v-model:year="account.birthDate.year"
                                v-model:month="account.birthDate.month"
                                v-model:day="account.birthDate.day"
                            />
                            <p v-if="errorBag.has('birthDate')" class="error-message">{{ errorBag.get("birthDate") }}</p>
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">
                                Adress
                            </label>
                            <p v-if="errorBag.has('address')" class="error-message">{{ errorBag.get("address") }}</p>
                            <div class="w-full flex flex-col">
                                <label class="text-gray-700 text-sm">Country</label>
                                <select
                                    id="country"
                                    v-model="account.user.address.country"
                                    class="w-1/2 mb-4 form-select input-select"
                                    :class="{ error: errorBag.has('country') }"
                                    name="country"
                                >
                                    <option :value="''">Select a Country</option>
                                    <option v-for="country in countries" :key="country">{{ country }}</option>
                                </select>
                                <p v-if="errorBag.has('country')" class="error-message">{{ errorBag.get("country") }}</p>
                            </div>
                            <div class="flex flex-row">
                                <div class="w-full pr-2 mb-4 flex flex-col">
                                    <label class="text-gray-700 text-sm">Street</label>
                                    <input
                                        id="street"
                                        v-model="account.user.address.street"
                                        type="text"
                                        name="street"
                                        class="w-full form-input input-text"
                                        :class="{ error: errorBag.has('street') }"
                                        placeholder="Street"
                                    />
                                    <p v-if="errorBag.has('street')" class="error-message">
                                        {{ errorBag.get("street") }}
                                    </p>
                                </div>
                                <div class="pl-2 flex flex-col">
                                    <label class="text-gray-700 text-sm">Number</label>
                                    <input
                                        id="number"
                                        v-model="account.user.address.houseNumber"
                                        type="text"
                                        name="number"
                                        class="w-full form-input input-text"
                                        :class="{ error: errorBag.has('houseNumber') }"
                                        placeholder="Number"
                                    />
                                    <p v-if="errorBag.has('houseNumber')" class="error-message">
                                        {{ errorBag.get("houseNumber") }}
                                    </p>
                                </div>
                            </div>
                            <div class="flex flex-row">
                                <div class="pr-2 flex flex-col">
                                    <label class="text-gray-700 text-sm">Zip Code</label>
                                    <input
                                        id="zipcode"
                                        v-model="account.user.address.zipCode"
                                        type="text"
                                        name="zipcode"
                                        class="w-full form-input input-text"
                                        :class="{ error: errorBag.has('zipCode') }"
                                        placeholder="Zip Code"
                                    />
                                    <p v-if="errorBag.has('zipCode')" class="error-message">
                                        {{ errorBag.get("zipCode") }}
                                    </p>
                                </div>
                                <div class="w-full pl-2 flex flex-col">
                                    <label class="text-gray-700 text-sm">City</label>
                                    <input
                                        id="city"
                                        v-model="account.user.address.city"
                                        type="text"
                                        name="city"
                                        class="w-full form-input input-text"
                                        :class="{ error: errorBag.has('city') }"
                                        placeholder="City"
                                    />
                                    <p v-if="errorBag.has('city')" class="error-message">{{ errorBag.get("city") }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section v-if="isLecturer" class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Lecturer Information</label>
                        <label class="block text-gray-600">
                            Information Specifically for a Lecturer
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3 flex flex-col">
                        <label class="text-gray-700 text-md font-medium mb-3">Description</label>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-sm font-medium mb-3">Free Text Description (optional)</label>
                            <textarea
                                id="description"
                                v-model="account.lecturer.freeText"
                                name="description"
                                cols="30"
                                rows="5"
                                class="w-full form-textarea border-2 border-gray-400 rounded-lg text-gray-600"
                                :class="{ error: errorBag.has('freeText') }"
                                placeholder="Add an optional Description for the Lecturer (Publications, Awards ...)"
                            >
                            </textarea>
                            <p v-if="errorBag.has('freeText')" class="error-message">{{ errorBag.get("freeText") }}</p>
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-sm font-medium mb-3">Fields of Research (optional)</label>
                            <textarea
                                id="researchField"
                                v-model="account.lecturer.researchArea"
                                name="researchField"
                                cols="30"
                                rows="3"
                                class="w-full form-textarea border-2 border-gray-400 rounded-lg text-gray-600"
                                :class="{ error: errorBag.has('researchArea') }"
                                placeholder="Add an optional Description of the Lecturer's Fields of Research"
                            >
>
                            </textarea>
                            <p v-if="errorBag.has('researchArea')" class="error-message">
                                {{ errorBag.get("researchArea") }}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section v-if="isStudent" class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Student Information</label>
                        <label class="block text-gray-600">
                            Information Specifically for a Student
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Immatriculation Status</label>
                            <div class="flex flex-row">
                                <div class="w-1/2 flex flex-col">
                                    <label class="text-gray-700 text-sm font-medium mb-3">Status</label>
                                    <input
                                        id="immatriculationStatus"
                                        v-model="account.student.immatriculationStatus"
                                        type="text"
                                        name="immatriculationStatus"
                                        class="w-full form-input input-text"
                                        :class="{ error: errorBag.has('immatriculationStatus') }"
                                        placeholder="Immatriculation Status"
                                    />
                                    <p v-if="errorBag.has('immatriculationStatus')" class="error-message">
                                        {{ errorBag.get("immatriculationStatus") }}
                                    </p>
                                </div>
                                <div class="w-1/4 flex flex-col pl-2">
                                    <label class="text-gray-700 text-sm font-medium mb-3">Matriculation-ID</label>
                                    <input
                                        id="matriculationId"
                                        v-model="account.student.matriculationId"
                                        type="text"
                                        name="matriculationId"
                                        class="w-full form-input input-text"
                                        :class="{ error: errorBag.has('matriculationId') }"
                                        placeholder="Matriculation-ID"
                                    />
                                    <p v-if="errorBag.has('matriculationId')" class="error-message">
                                        {{ errorBag.get("matriculationId") }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="mb-4 mt-8 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Study Status</label>
                            <div class="flex flex-row">
                                <div class="w-1/2 flex flex-col">
                                    <label class="text-gray-700 text-sm font-medium mb-3">Fields of Study</label>
                                    <multi-select
                                        :input-list="fieldsOfStudy"
                                        :pre-selection="account.student.fieldsOfStudy"
                                        placeholder="Select a Field of Study"
                                        @changed="updateFieldsOfStudy"
                                    />
                                    <p v-if="errorBag.has('fieldsOfStudy')" class="error-message">
                                        {{ errorBag.get("fieldsOfStudy") }}
                                    </p>
                                </div>
                                <div class="w-1/4 pl-2 flex flex-col">
                                    <label class="text-gray-700 text-sm font-medium mb-3">Semester Count</label>
                                    <input
                                        id="semesterCount"
                                        v-model="account.student.semesterCount"
                                        type="number"
                                        name="semesterCount"
                                        class="w-full form-input input-text"
                                        :class="{ error: errorBag.has('semesterCount') }"
                                        placeholder="Semester Count"
                                    />
                                    <p v-if="errorBag.has('semesterCount')" class="error-message">
                                        {{ errorBag.get("semesterCount") }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="border-t-2 py-8 border-gray-400" :hidden="!editMode">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Profile Picture</label>
                        <label class="block text-gray-600">
                            Change the Profile Picture
                        </label>
                    </div>
                    <div class="flex flex-col items-center justify-center">
                        <img class="object-contain h-48" :src="account.user.picture" />
                        <button
                            class="bg-transparent hover:bg-blue-800 border-blue-700 border-2 text-blue-700 font-semibold hover:text-white py-2 px-4 border hover:border-transparent rounded-lg"
                            @click="updatePicture"
                        >
                            Update Profile Picture
                        </button>
                    </div>
                </div>
            </section>
            <section class="border-t-2 py-8 border-gray-400 lg:mt-8">
                <div class="hidden sm:flex justify-between">
                    <div class="flex justify-start items-center">
                        <button v-if="editMode" type="button" class="w-32 btn btn-red-secondary" @click="confirmDeleteAccount">
                            Delete
                        </button>
                    </div>

                    <div class="flex justify-end items-center">
                        <button type="button" class="w-32 mr-6 btn btn-blue-secondary" @click="back">
                            Cancel
                        </button>
                        <button v-if="editMode" :disabled="!hasInput" class="w-48 w-full btn btn-blue-primary" @click="updateAccount">
                            Save Changes
                        </button>
                        <button v-else :disabled="!hasInput" class="w-48 btn btn-blue-primary" @click="createAccount">
                            Create Account
                        </button>
                    </div>
                </div>

                <!-- different button layout for mobile -->
                <div class="sm:hidden">
                    <button type="button" class="mb-4 w-full btn btn-blue-secondary" @click="back">
                        Cancel
                    </button>
                    <button
                        v-if="editMode"
                        :disabled="!hasInput"
                        type="button"
                        class="mb-4 w-full w-full btn btn-blue-primary"
                        @click="updateAccount"
                    >
                        Save Changes
                    </button>
                    <button v-else :disabled="!hasInput" class="mb-4 w-full btn btn-blue-primary" @click="createAccount">
                        Create Account
                    </button>
                    <button class="w-full btn btn-red-secondary" @click="confirmDeleteAccount">
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
    import MultiSelect from "@/components/MultiSelect.vue";
    import BirthDatePicker from "@/components/BirthDatePicker.vue";

    export default {
        name: "AdminCreateAccountForm",
        components: {
            DeleteAccountModal,
            MultiSelect,
            BirthDatePicker,
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
            let roles = Object.values(Role).filter((e) => e != Role.NONE);
            let fieldsOfStudy = Object.values(FieldOfStudy).filter((e) => e != FieldOfStudy.NONE);
            let countries = Object.values(Country).filter((e) => e != Country.NONE);
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

            function updateFieldsOfStudy(value: any) {
                account.student.fieldsOfStudy = value.value.filter((f: String) => f != FieldOfStudy.NONE);
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

                if (success.value) {
                    back();
                } else {
                    errorBag.replaceAllWith(handler.errorList);
                    //TODO: change the following line?
                    this.$forceUpdate();
                }
            }

            function updateAccount() {
                const userManagement: UserManagement = new UserManagement();
                account.user.birthDate = account.birthDate.year + "-" + account.birthDate.month + "-" + account.birthDate.day;
                var adaptedUser: Student | Lecturer | Admin = assembleAccount();
                userManagement.updateUser(adaptedUser).then((response) => {
                    if (response) {
                        success.value = true;
                        emit("update:success", success.value);
                        back();
                    }
                });
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
                roles,
                countries,
                updatePicture,
                isLecturer,
                isStudent,
                fieldsOfStudy,
                hasInput,
                back,
                createAccount,
                updateAccount,
                deleteAccount,
                confirmDeleteAccount,
                deleteModal,
                errorBag: errorBag,
                updateFieldsOfStudy,
            };
        },
    };
</script>
