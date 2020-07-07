<template>

    <div class="w-full lg:mt-20 mt-8 bg-gray-300 mx-auto h-screen">
        <button @click="back()" class="flex items-center mb-4 navigation-link">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Back</span>
        </button>

        <h1 class="text-2xl font-medium text-gray-700 mb-8">Account Creation</h1>

        <div>
            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Select a Role</label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="mb-4 flex">
                             <div class="mr-4 mb-3" v-for="role in roles" :key="role">
                                <label class="flex items-center" >
                                    <input type="radio" class="form-radio radio" name="role" :disabled="editMode" :value="role" v-model="account.user.role">
                                        <span class="ml-2 text-gray-700 text-md font-medium">{{ role }}</span>
                                </label>
                            </div>
                            <p v-if="hasError('role')" class="text-red-600 ml-1 mt-1">{{ showError('role') }}</p>
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
                            <input type="text" id="userName" name="Username"
                                class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input disabled:bg-gray-400"
                                placeholder="Username"
                                v-model="account.user.username"
                                :disabled="editMode">
                            <p v-if="hasError('username')" class="text-red-600 ml-1 mt-1">{{ showError('username') }}</p>
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Email</label>
                            <input type="text" id="email" name="email"
                                class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                placeholder="example@mail.com"
								v-model="account.user.email"
                                >
                            <p v-if="hasError('email')" class="text-red-600 ml-1 mt-1">{{ showError('email') }}</p>
                        </div>
                        <div class="mb-4 flex flex-col" v-if="!editMode">
                            <label for="password" class="text-gray-700 text-md font-medium mb-3">
                                Password
                            </label>
                            <input type="text" id="password" name="password"
                                class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                placeholder="Password"
                                v-model="account.authUser.password">
                            <p v-if="hasError('password')" class="text-red-600 ml-1 mt-1">{{ showError('password') }}</p>
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
                            <div class="flex flex-row ">
                                <div class="w-full pr-2 flex-col">
                                    <label class="text-gray-700 text-sm">Firstname</label>
                                    <input type="text" id="firstName" name="firstName"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Firstname"
										v-model="account.user.firstName"
                                        >
                                    <p v-if="hasError('firstName')" class="text-red-600 ml-1 mt-1">{{ showError('firstName') }}</p>
                                </div>
                                <div class="w-full pl-2 flex-col">
                                    <label class="text-gray-700 text-sm">Lastname</label>
                                    <input type="text" id="lastName" name="lastName"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Lastname"
										v-model="account.user.lastName"
                                        >
                                    <p v-if="hasError('lastName')" class="text-red-600 ml-1 mt-1">{{ showError('lastName') }}</p>
                                </div>
                            </div>
                        </div>
						<div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">
                                Birthdate
                            </label>
                            <p v-if="hasError('birthdate')" class="text-red-600 ml-1 mt-1">{{ showError('birthdate') }}</p>
                            <div class="flex flex-row ">
                                <div class="w-full pr-2 flex-col">
                                    <label class="text-gray-700 text-sm">Day</label>
                                    <input type="number" id="day" name="day"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="DD"
										v-model="account.birthdate.day"
                                        >
                                </div> 
								<div class="w-full px-2 flex-col">
                                    <label class="text-gray-700 text-sm">Month</label>
                                    <input type="number" id="month" name="month"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="MM"
										v-model="account.birthdate.month"
                                        >
                                </div>
								<div class="w-full pl-2 flex-col">
                                    <label class="text-gray-700 text-sm">Year</label>
                                    <input type="number" id="year" name="year"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="YYYY"
										v-model="account.birthdate.year"
                                        >
                                </div>
                            </div>
                        </div>
                        <div class="mb-4 flex flex-col">
                                <label class="text-gray-700 text-md font-medium mb-3">
                                    Adress 
                                </label>
                                <p v-if="hasError('address')" class="text-red-600 ml-1 mt-1">{{ showError('address') }}</p>
                                <div class="w-full flex flex-col">
                                    <label class="text-gray-700 text-sm">Country</label>
                                    <select class="w-1/2 py-3 mb-4 rounded-lg border-gray-400 text-gray-600 form-select" 
                                    name="country" id="country"
                                    v-model="account.user.address.country">
                                        <option :value="''" >Select a Country</option>
                                        <option v-for="country in countries" :key="country">{{ country }}</option>
                                    </select>
                                    <p v-if="hasError('country')" class="text-red-600 ml-1 mt-1">{{ showError('country') }}</p>
                                </div>
                            <div class="flex flex-row ">
                                <div class="w-full pr-2 mb-4 flex flex-col">
                                    <label class="text-gray-700 text-sm">Street</label>
                                    <input type="text" id="street" name="street"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Street"
										v-model="account.user.address.street">
                                    <p v-if="hasError('street')" class="text-red-600 ml-1 mt-1">{{ showError('street') }}</p>
                                </div>
                                <div class="pl-2 flex flex-col">
                                    <label class="text-gray-700 text-sm">Number</label>
                                    <input type="text" id="number" name="number"
                                        class="border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Number"
										v-model="account.user.address.houseNumber">
                                    <p v-if="hasError('houseNumber')" class="text-red-600 ml-1 mt-1">{{ showError('houseNumber') }}</p>
                                </div>
                            </div>
                            <div class="flex flex-row ">
                                <div class="pr-2 flex flex-col">
                                    <label class="text-gray-700 text-sm">Zip Code</label>
                                    <input type="text" id="zipcode" name="zipcode"
                                        class="border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Zip Code"
										v-model="account.user.address.zipCode">
                                    <p v-if="hasError('zipCode')" class="text-red-600 ml-1 mt-1">{{ showError('zipCode') }}</p>
                                </div>
                                 <div class="w-full pl-2 flex flex-col">
                                 <label class="text-gray-700 text-sm">City</label>
                                    <input type="text" id="city" name="city"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="City"
										v-model="account.user.address.city">
                                    <p v-if="hasError('city')" class="text-red-600 ml-1 mt-1">{{ showError('city') }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
			<section class="border-t-2 py-8 border-gray-400" v-if="isLecturer">
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
                            <textarea name="description" id="description" cols="30" rows="5" class="w-full form-textarea border-2 border-gray-400 rounded-lg text-gray-600"
                                placeholder="Add an optional Description for the Lecturer (Publications, Awards ...)"
								v-model="account.lecturer.freeText">
                            </textarea>
                            <p v-if="hasError('freeText')" class="text-red-600 ml-1 mt-1">{{ showError('freeText') }}</p>
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-sm font-medium mb-3">Fields of Research (optional)</label>
                            <textarea name="researchField" id="researchField" cols="30" rows="3" class="w-full form-textarea border-2 border-gray-400 rounded-lg text-gray-600"
                                placeholder="Add an optional Description of the Lecturer's Fields of Research"
								v-model="account.lecturer.researchArea">>
                            </textarea>
                            <p v-if="hasError('researchArea')" class="text-red-600 ml-1 mt-1">{{ showError('researchArea') }}</p>
                        </div>
                    </div>
				</div>
			</section>
			<section class="border-t-2 py-8 border-gray-400" v-if="isStudent">
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
                                    <input type="text" id="immatriculationStatus" name="immatriculationStatus"
                                                class="border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                                placeholder="Immatriculation Status"
                                                v-model="account.student.immatriculationStatus">
                                    <p v-if="hasError('immatriculationStatus')" class="text-red-600 ml-1 mt-1">{{ showError('immatriculationStatus') }}</p>
                                </div>
                                 <div class="w-1/4 flex flex-col pl-2">
                                    <label class="text-gray-700 text-sm font-medium mb-3">Matriculation-ID</label>
                                    <input type="text" id="matriculationId" name="matriculationId"
                                                class="border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                                placeholder="Matriculation-ID"
                                                v-model="account.student.matriculationId">
                                    <p v-if="hasError('matriculationId')" class="text-red-600 ml-1 mt-1">{{ showError('matriculationId') }}</p>
                                 </div>
                            </div>
                        </div>
						<div class="mb-4 mt-8 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Study Status</label>
							<div class="flex flex-row ">
                                <div class="w-1/2 flex flex-col">
                                    <label class="text-gray-700 text-sm font-medium mb-3">Fields of Study</label>
                                    <!-- v-for begins counting at 1, hence 1 is substracted for handling of the arrays -->
                                    <div class="w-full flex flex-row items-center" v-for="index in selectedFieldsOfStudy+1" :key="index">
                                        <select class="w-4/5 mr-1 my-2 py-3 rounded-lg border-gray-400 text-gray-600 form-select" 
                                            v-model="account.student.fieldsOfStudy[index-1]"
                                            @change="addFieldOfStudy($event.target.value,index-1)"
                                        >
                                        
                                            <option disabled :value="''">Select a Field of Study</option>
                                            <option v-for="field in fieldsOfStudyLists[index-1]" :key="field">{{ field }}</option>
                                        </select>
                                        <div class="w-1/6 items-center justify-center">
                                            <button v-if="account.student.fieldsOfStudy[index-1] != ''" @click="removeFieldOfStudy(index-1)" 
                                            title="Remove Selected Field Of Study"
                                            class="w-1/2 m-1 bg-gray-100 text-gray-700 hover:text-white hover:bg-red-800 hover:border-red-800 rounded-lg border border-gray-600"> 
                                                <i class="inline far fa-trash-alt text-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p v-if="hasError('fieldsOfStudy')" class="text-red-600 ml-1 mt-1">{{ showError('fieldsOfStudy') }}</p>
                                </div>
								<div class="w-1/4 pl-2 flex flex-col">
                                    <label class="text-gray-700 text-sm font-medium mb-3">Semester Count</label>
                                    <input type="number" id="semesterCount" name="semesterCount"
                                        class="border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Semester Count"
										v-model="account.student.semesterCount">
                                    <p v-if="hasError('semesterCount')" class="text-red-600 ml-1 mt-1">{{ showError('semesterCount') }}</p>
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
						<img class="object-contain h-48" :src="account.user.picture">
						<button class="bg-transparent hover:bg-blue-800 border-blue-700 border-2 text-blue-700 font-semibold hover:text-white py-2 px-4 border hover:border-transparent rounded-lg"
						@click="updatePicture">Update Profile Picture</button>
					</div>
				</div>
			</section>
            <section class="border-t-2 py-8 border-gray-400 lg:mt-8">
                <div class="hidden sm:flex justify-between">
                    <div class="flex justify-start items-center">
                        <button v-if="editMode" @click="confirmDeleteAccount" type="button" class="w-32 btn btn-red-secondary">
                            Delete
                        </button>
                    </div>

                    <div class="flex justify-end items-center">
                        <button type="button" @click="back" class="w-32 mr-6 btn btn-blue-secondary">
                            Cancel
                        </button>
                        <button v-if="editMode" @click="updateAccount" :disabled="!hasInput" class="w-48 w-full btn btn-blue-primary">
                            Save Changes
                        </button>
                        <button v-else @click="createAccount" :disabled="!hasInput" class="w-48 btn btn-blue-primary">
                            Create Account
                        </button>
                    </div>
                </div>

                <!-- different button layout for mobile -->
                <div class="sm:hidden">
                    <button type="button" @click="back" class="mb-4 w-full btn btn-blue-secondary">
                        Cancel
                    </button>
                    <button v-if="editMode" :disabled="!hasInput" type="button" @click="updateAccount" class="mb-4 w-full w-full btn btn-blue-primary">
                        Save Changes
                    </button>
                    <button v-else :disabled="!hasInput" @click="createAccount" class="mb-4 w-full btn btn-blue-primary">
                        Create Account
                    </button>
                    <button @click="confirmDeleteAccount" class="w-full btn btn-red-secondary">
                        Delete
                    </button>
                </div>
            </section>

            <delete-account-modal ref="deleteModal"/>
            <unsaved-changes-modal ref="unsavedChangesModal"/>
        </div>
    </div>
</template>

<script lang="ts">
import Router from "@/router/";
import {Role} from '@/entities/Role'
import { store } from '@/store/store';
import { ref, reactive, computed, onMounted } from 'vue';
import {FieldOfStudy} from '@/api/api_models/user_management/FieldOfStudy'
import UserManagement from "@/api/UserManagement"
import StudentEntity from "@/entities/StudentEntity"
import UserEntity from "@/entities/UserEntity"
import LecturerEntity from "@/entities/LecturerEntity"
import AdminEntity from "@/entities/AdminEntity"
import { Account } from '../../entities/Account';
import Admin from '../../api/api_models/user_management/Admin';
import Student from '../../api/api_models/user_management/Student';
import Lecturer from '../../api/api_models/user_management/Lecturer';
import DeleteAccountModal from "@/components/modals/DeleteAccountModal.vue";
import UnsavedChangesModal from "@/components/modals/UnsavedChangesModal.vue";
import { Country } from '../../entities/Country';
import User from '../../api/api_models/user_management/User';
import useErrorHandler from '@/use/ErrorHandler';
import ValidationResponseHandler from '../../use/ValidationResponseHandler';
import GenericResponseHandler from "@/use/GenericResponseHandler"

export default {
    name: "AdminCreateAccountForm",
    components: {
        DeleteAccountModal,
        UnsavedChangesModal,
    },
    props: {
        editMode: {
            type: Boolean,
            required: true
        }
    },
    setup(props) {
        let account = reactive( {
            authUser: new Account(),
            user: new UserEntity(),
            admin: new AdminEntity(false),
            student: new StudentEntity(false),
            lecturer: new LecturerEntity(false),
			birthdate: {
				day: "",
				month: "",
				year: "",
			},
        })
        let initialAccount = {
            authUser: new Account(),
            user: new UserEntity(),
            admin: new AdminEntity(false),
            student: new StudentEntity(false),
            lecturer: new LecturerEntity(false),
			birthdate: {
				day: "",
				month: "",
				year: "",
			},
        }

        account.student.fieldsOfStudy[0] = initialAccount.student.fieldsOfStudy[0] = FieldOfStudy.NONE;
        let selectedFieldsOfStudy = ref(0);
        let success = ref(new Boolean());
        success.value = false;
		let roles = Object.values(Role).filter(e => e != Role.NONE);
        let fieldsOfStudy = Object.values(FieldOfStudy).filter(e => e != FieldOfStudy.NONE);
        let fieldsOfStudyLists:FieldOfStudy[][] = reactive([fieldsOfStudy]);
        let countries = Object.values(Country).filter(e => e != Country.NONE);
        let unsavedChangesModal = ref();
        let deleteModal = ref();
        
        let { errorList, hasError, showError} = useErrorHandler();
        let errors = reactive(errorList);

		let isLecturer = computed(() => {
			return account.user.role === Role.LECTURER;
		})

		let isStudent = computed(() => {
			return account.user.role === Role.STUDENT;
        })
        
        onMounted( () => {
            if(props.editMode) {
                loadAccount();
            }
        })

        async function loadAccount() {
            const userManagement: UserManagement = new UserManagement();

            const response = await userManagement.getSpecificUser(Router.currentRoute.value.params.username as string)
            const genericResponseHandler = new GenericResponseHandler();
            const result = genericResponseHandler.handleReponse(response);
            
            //TODO move this to a non-generic response handler
            if (response.statusCode !== 200) {
                alert("User not found")
            } else {
                //TODO Remove next line when lagom finally manage to send a birthdate
                result.birthdate = "1996-12-11";

                account.user  = result;
                initialAccount.user = JSON.parse(JSON.stringify(account.user)) ;
                let dates = result.birthdate.split("-");
                account.birthdate.day = initialAccount.birthdate.day = dates[2];
                account.birthdate.month = initialAccount.birthdate.month = dates[1];
                account.birthdate.year = initialAccount.birthdate.year = dates[0];

                if(result.role == Role.LECTURER) {
                    account.lecturer = (result as Lecturer);
                    initialAccount.lecturer = JSON.parse(JSON.stringify(account.lecturer));
                }
                else if(result.role == Role.STUDENT ) {
                    account.student = (result as Student);
                    account.student.fieldsOfStudy[account.student.fieldsOfStudy.length] = FieldOfStudy.NONE;
                    initialAccount.student = JSON.parse(JSON.stringify(account.student));
                    selectedFieldsOfStudy.value = account.student.fieldsOfStudy.length-1;
                    for (let i = 0; i <= selectedFieldsOfStudy.value ; i++ ) {
                        fieldsOfStudyLists[i] = fieldsOfStudy;
                    }
                    updateFieldOfStudyLists();
                }
                else if(result.role == Role.ADMIN ) {
                    account.admin = (result as Admin)
                    initialAccount.admin = JSON.parse(JSON.stringify(account.admin))
                }
            }
        }

        function addFieldOfStudy(field:FieldOfStudy, index:number) {
            if(selectedFieldsOfStudy.value == index) {
                selectedFieldsOfStudy.value++;
                fieldsOfStudyLists[index+1] = fieldsOfStudy;
                account.student.fieldsOfStudy[index+1] = FieldOfStudy.NONE
            }
            account.student.fieldsOfStudy[index] = field;
            
            updateFieldOfStudyLists();
        }

        function removeFieldOfStudy(index:number) {
            let toDelete = account.student.fieldsOfStudy[index];
            account.student.fieldsOfStudy = account.student.fieldsOfStudy.filter(field => field != toDelete);
            if(selectedFieldsOfStudy.value != index) {
                selectedFieldsOfStudy.value--;
                fieldsOfStudyLists[selectedFieldsOfStudy.value] = [];
            }
            updateFieldOfStudyLists();
        }

        function updateFieldOfStudyLists() {
            for (let i = 0 ; i < fieldsOfStudyLists.length ; i++) {
                fieldsOfStudyLists[i] = fieldsOfStudy;
                for (let j = 0; j < account.student.fieldsOfStudy.length ; j++) {
                    if(i != j) {
                        fieldsOfStudyLists[i] = fieldsOfStudyLists[i].filter(e => e!= account.student.fieldsOfStudy[j]);
                    }
                }
            }
        }
        
		function updatePicture() {
			console.log(account)
            console.log(initialAccount)
		}
		
        let hasInput = computed(() => {
            if( 
                //Role and password can only be set during account creation
                (!props.editMode && account.user.role != Role.NONE) || (!props.editMode && account.authUser.password != "") || 
                //default user names
                account.user.username != initialAccount.user.username || account.user.firstName != initialAccount.user.firstName ||
                account.user.lastName != initialAccount.user.lastName || account.user.email != initialAccount.user.email ||
                //default user birthdate from the form
                account.birthdate.day != initialAccount.birthdate.day ||account.birthdate.month != initialAccount.birthdate.month || account.birthdate.year != initialAccount.birthdate.year ||
                //default user address
                account.user.address.country != initialAccount.user.address.country || account.user.address.street != initialAccount.user.address.street ||
                account.user.address.houseNumber != initialAccount.user.address.houseNumber || account.user.address.zipCode != initialAccount.user.address.zipCode||
                account.user.address.city != initialAccount.user.address.city||
                account.user.picture != initialAccount.user.picture ||
                //lecturer properties
                account.lecturer.freeText != initialAccount.lecturer.freeText || account.lecturer.researchArea != initialAccount.lecturer.researchArea||
                //student properties
                account.student.immatriculationStatus != initialAccount.student.immatriculationStatus || account.student.matriculationId != initialAccount.student.matriculationId ||
                account.student.semesterCount != initialAccount.student.semesterCount) {
                    return true;
                }
                
                //check whether a field of study has been added or removed
                for( let field of account.student.fieldsOfStudy) {
                    if(!initialAccount.student.fieldsOfStudy.includes(field)) {
                        return true;
                    }
                }

                for( let field of initialAccount.student.fieldsOfStudy) {
                    if(!account.student.fieldsOfStudy.includes(field)) {
                        return true;
                    }
                }
                
            return false;
        })
        
        async function confirmDeleteAccount() {
                let modal = deleteModal.value;
                let action = modal.action;
                modal.show()
                    .then((response: typeof action) => {
                        switch(response) {
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

        

        function assembleAccount() :  Student | Lecturer | Admin {
             var newUser: Student | Lecturer | Admin = {} as Student;
                switch(account.user.role) {
                    case Role.ADMIN: {
                        newUser = {
                            ...account.admin,
                            ...account.user
                        };
                        break;
                    }
                    case Role.STUDENT: {
                        newUser = {
                            ...account.student,
                            ...account.user
                        } as Student;
                        if("fieldsOfStudy" in newUser) {
                            newUser.fieldsOfStudy = newUser.fieldsOfStudy.filter(field => field != FieldOfStudy.NONE);
                        }
                        break;
                    }
                    case Role.LECTURER: {
                        newUser = {
                            ...account.lecturer,
                            ...account.user
                        };
                        break;
                    }
                }
            return newUser;
        }

        function isValid() {
             if(account.user.role == Role.NONE || account.user.username == "" || account.user.email == "" || account.authUser.password == "" ||
                account.user.firstName == "" || account.user.lastName == "" || account.birthdate.day == "" || account.birthdate.month == "" || 
                account.birthdate.year == "" || account.user.address.country == "Country" || account.user.address.street == "" ||
                account.user.address.houseNumber == "" || account.user.address.zipCode == "" || account.user.address.city == "") {
                    return false;
			}

			if( account.user.role == Role.STUDENT) {
                //account.student.semesterCount can have typeof String due to a bug in vue, if the number input field is empty
				if( account.student.immatriculationStatus == "" || account.student.matriculationId == "" || 
				account.student.semesterCount < 0 || typeof account.student.semesterCount != "number" || account.student.fieldsOfStudy.length == 0) {
					return false;
				}
			}

			//For the Lecturer, there cannot be any invalid inputs as the inputs are optional at this point. 
			//Admin has no additional Inputs
            return true;
        }

        async function createAccount() {
             if(isValid()) {    
                const userManagement: UserManagement = new UserManagement();
                account.authUser.username = account.user.username;
                account.authUser.role = account.user.role;
                account.user.birthdate = account.birthdate.year + "-" + account.birthdate.month + "-" + account.birthdate.day;

                var newUser: Student | Lecturer | Admin = assembleAccount();

                // delete old errors
                errors.length = 0;
                const response = await userManagement.createUser(account.authUser, newUser);
                const handler =  new ValidationResponseHandler();
                success.value = handler.handleReponse(response);

                if(success.value) {
                    back();
                } else {
                    errors.push(...handler.errorList);
                    //TODO: change the following line?
                    this.$forceUpdate()
                }
            }
            else {
				console.log("Error: Input Validation Failed!")
                success.value = false;
            }
        }

        function updateAccount() {
            const userManagement: UserManagement = new UserManagement();
            var adaptedUser: Student | Lecturer | Admin = assembleAccount();
            userManagement.updateUser(adaptedUser).then( (response) => {
                if(response) {
                    success.value = true;
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
                back()
            }
        }

        function back() {
            Router.back();
        }

        return {
            account,
            selectedFieldsOfStudy,
            success,
            roles,
            countries,
			updatePicture,
			isLecturer,
			isStudent,
            fieldsOfStudyLists,
            fieldsOfStudy,
            addFieldOfStudy,
            removeFieldOfStudy,
            updateFieldOfStudyLists,
			hasInput,
            isValid,
            back,
            createAccount,
            updateAccount,
            deleteAccount,
            confirmDeleteAccount,
            unsavedChangesModal,
            deleteModal,
            hasError,
            showError,
        }
    },

	beforeRouteEnter(_from: any, _to: any, next: any) {
		const myRole = store.state.myRole;
		if (myRole != Role.ADMIN) {
			return next("/redirect");
		}
		return next();
	},
    beforeRouteLeave (to: any, from: any, next: any) {
        if (this.success) {
            return next();
        }
        if (this.hasInput) {
            const modal = this.unsavedChangesModal;
            let action = modal.action;
            modal.show()
                .then((response: typeof action) => {
                    switch(response) {
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
                })
        } else {
            next(true);
       }
    }
};
</script>
