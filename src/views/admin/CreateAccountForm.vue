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
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Email</label>
                            <input type="text" id="email" name="email"
                                class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                placeholder="example@mail.com"
								v-model="account.user.email"
                                >
                        </div>
                        <div class="mb-4 flex flex-col" v-if="!editMode">
                            <label for="password" class="text-gray-700 text-md font-medium mb-3">
                                Password
                            </label>
                            <input type="text" id="password" name="password"
                                class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                placeholder="Password"
                                v-model="account.authUser.password">
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
                                </div>
                                <div class="w-full pl-2 flex-col">
                                    <label class="text-gray-700 text-sm">Lastname</label>
                                    <input type="text" id="lastName" name="lastName"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Lastname"
										v-model="account.user.lastName"
                                        >
                                </div>
                            </div>
                        </div>
						<div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">
                                Birthdate
                            </label>
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
                                <div class="w-full flex flex-col">
                                    <label class="text-gray-700 text-sm">Country</label>
                                    <select class="w-1/2 py-3 mb-4 rounded-lg border-gray-400 text-gray-600 form-select" 
                                    name="country" id="country"
                                    v-model="account.user.address.country">
                                        <option :value="''" >Select a Country</option>
                                        <option v-for="country in countries" :key="country">{{ country }}</option>
                                    </select>
                                </div>
                            <div class="flex flex-row ">
                                <div class="w-full pr-2 mb-4 flex flex-col">
                                    <label class="text-gray-700 text-sm">Street</label>
                                    <input type="text" id="street" name="street"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Street"
										v-model="account.user.address.street">
                                </div>
                                <div class="pl-2 flex flex-col">
                                    <label class="text-gray-700 text-sm">Number</label>
                                    <input type="text" id="number" name="number"
                                        class="border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Number"
										v-model="account.user.address.houseNumber">
                                </div>
                            </div>
                            <div class="flex flex-row ">
                                <div class="pr-2 flex flex-col">
                                    <label class="text-gray-700 text-sm">Zip Code</label>
                                    <input type="text" id="zipcode" name="zipcode"
                                        class="border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Zip Code"
										v-model="account.user.address.zipCode">
                                </div>
                                 <div class="w-full pl-2 flex flex-col">
                                 <label class="text-gray-700 text-sm">City</label>
                                    <input type="text" id="city" name="city"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="City"
										v-model="account.user.address.city">
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
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-sm font-medium mb-3">Fields of Research (optional)</label>
                            <textarea name="researchField" id="researchField" cols="30" rows="3" class="w-full form-textarea border-2 border-gray-400 rounded-lg text-gray-600"
                                placeholder="Add an optional Description of the Lecturer's Fields of Research"
								v-model="account.lecturer.researchArea">>
                            </textarea>
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
                                </div>
                                 <div class="w-1/4 flex flex-col pl-2">
                                    <label class="text-gray-700 text-sm font-medium mb-3">Matriculation-ID</label>
                                    <input type="text" id="matriculationId" name="matriculationId"
                                                class="border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                                placeholder="Matriculation-ID"
                                                v-model="account.student.matriculationId">
                                 </div>
                            </div>
                        </div>
						<div class="mb-4 mt-8 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Study Status</label>
							<div class="flex flex-row ">
                                <div class="w-1/2 flex flex-col">
                                    <label class="text-gray-700 text-sm font-medium mb-3">Fields of Study</label>
                                    <!-- v-for begins counting at 1, hence 1 is substracted for handling of the arrays -->
                                    <div class="w-full" v-for="index in selectedFieldsOfStudy+1" :key="index">
                                        <select class="w-full mb-4 py-3 rounded-lg border-gray-400 text-gray-600 form-select" 
                                        name="country" id="country" v-model="account.student.fieldsOfStudy[index-1]"
                                        >
                                        <option :value="undefined" @click="removeFieldOfStudy(index-1)">Select a Field of Study</option>
                                        <option v-for="field in fieldsOfStudyLists[index-1]" :key="field" @click="addFieldOfStudy(field,index-1)">{{ field }}</option>
                                        </select>
                                    </div>
                                </div>
								<div class="w-1/4 pl-2 flex flex-col">
                                    <label class="text-gray-700 text-sm font-medium mb-3">Semester Count</label>
                                    <input type="number" id="semesterCount" name="semesterCount"
                                        class="border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Semester Count"
										v-model="account.student.semesterCount">
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

        let selectedFieldsOfStudy = ref(0);
        let success = ref(new Boolean());
        success.value = false;
		let roles = Object.values(Role).filter(e => e!=Role.NONE);
        let fieldsOfStudy = Object.values(FieldOfStudy);
        let fieldsOfStudyLists:FieldOfStudy[][] = reactive([fieldsOfStudy]);
        let countries = Object.values(Country).filter(e => e!= Country.NONE);
        let unsavedChangesModal = ref();
        let deleteModal = ref();
		
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

        function loadAccount() {
            const userManagement: UserManagement = new UserManagement();
            userManagement.getSpecificUser(Router.currentRoute.value.params.username as string).then(( response: Student | Lecturer | Admin) => {
                //TODO Remove next line when lagom finally manage to send a birthdate
                response.birthdate = "1996-12-11";

                account.user  = response;
                initialAccount.user = JSON.parse(JSON.stringify(account.user)) ;
                let dates = response.birthdate.split("-");
                account.birthdate.day = initialAccount.birthdate.day = dates[2];
                account.birthdate.month = initialAccount.birthdate.month = dates[1];
                account.birthdate.year = initialAccount.birthdate.year = dates[0];

                if(response.role == Role.LECTURER) {
                    account.lecturer = (response as Lecturer);
                    initialAccount.lecturer = JSON.parse(JSON.stringify(account.lecturer));
                }
                else if(response.role == Role.STUDENT ) {
                    account.student = (response as Student);
                    initialAccount.student = JSON.parse(JSON.stringify(account.student));
                    selectedFieldsOfStudy.value = account.student.fieldsOfStudy.length;
                    for (let i = 0; i < selectedFieldsOfStudy.value ; i++ ) {
                        fieldsOfStudyLists[i] = fieldsOfStudy;
                    }
                    updateFieldOfStudyLists();
                }
                else if(response.role == Role.ADMIN ) {
                    account.admin = (response as Admin)
                    initialAccount.admin = JSON.parse(JSON.stringify(account.admin))
                }
            })
        }


        function addFieldOfStudy(field:FieldOfStudy, index:number) {
            if(selectedFieldsOfStudy.value == index) {
                selectedFieldsOfStudy.value++;
                fieldsOfStudyLists[index+1] = fieldsOfStudy;
            }
            account.student.fieldsOfStudy[index] = field;
            
            updateFieldOfStudyLists();
        }

        function removeFieldOfStudy(index:number) {
            let toDelete = account.student.fieldsOfStudy[index];
            account.student.fieldsOfStudy = account.student.fieldsOfStudy.filter(field => field != toDelete);
            if(selectedFieldsOfStudy.value != index) {
                selectedFieldsOfStudy.value--;
                fieldsOfStudyLists[index+1] = [];
            }
            console.log(fieldsOfStudyLists)
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

                // for(let course in account.student.fieldsOfStudy) {
                //     if(! (initialAccount.student.fieldsOfStudy.filter( e => e==course).length == 0)) {
                //         console.log(initialAccount.student.fieldsOfStudy.filter( e => e==course))
                //         console.log("Triggered")
                //         return true;
                //     }
                // }
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
                        };
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

         function createAccount() {
             if(isValid()) {    
                const userManagement: UserManagement = new UserManagement();
                account.authUser.username = account.user.username;
                account.authUser.role = account.user.role;
                account.user.birthdate = account.birthdate.year + "-" + account.birthdate.month + "-" + account.birthdate.day;

                var newUser: Student | Lecturer | Admin = assembleAccount();

                userManagement.createUser(account.authUser, newUser)
                .then( (value) => {
                    if(value) {
                        success.value = true;
                        back();
                    }
                    else {
                        console.log("API call failed!");
                        success.value = false;
                    }
                });
            }
            else {
				console.log("Error: Input Validation Failed!")
                success.value = false;
            }
        }

        function updateAccount() {
            const userManagement: UserManagement = new UserManagement();
            var adaptedUser: Student | Lecturer | Admin = assembleAccount();
            console.log(adaptedUser);
            userManagement.updateUser(adaptedUser).then( (response) => {
                if(response) {
                    success.value = true;
                    back();
                }
            });
        }

        function deleteAccount() {
            const userManagement: UserManagement = new UserManagement();
            userManagement.deleteUser(account.user.username).then( (value) => {
                if(value) {
                    success.value = true;
                    back();
                }
            })
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
