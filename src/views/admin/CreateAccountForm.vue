<template>

    <div class="w-full lg:mt-20 mt-8 bg-gray-300 mx-auto h-screen">
        <button @click="navigateBack()" class="flex items-center mb-4 navigation-link">
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
                                    <input type="radio" class="form-radio radio" name="role" :value="role" v-model="account.user.role">
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
                        <label class="block text-gray-700 text-lg font-medium mb-2">Basics</label>
                        <label class="block text-gray-600">
                            Basic Information for the new User Account
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Username</label>
                            <input type="text" id="userName" name="username"
                                class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                placeholder="Username"
                                v-model="account.user.username">
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Email</label>
                            <input type="text" id="email" name="email"
                                class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                placeholder="Email"
								v-model="account.user.email"
                                >
                        </div>
                        <div class="mb-4 flex flex-col">
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
                            Basic Information for the new User Account
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">
                                Name
                            </label>
                            <div class="flex flex-row ">
                                <div class="w-full pr-2">
                                    <input type="text" id="firstName" name="firstName"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Firstname"
										v-model="account.user.firstName"
                                        >
                                </div>
                                <div class="w-full pl-2">
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
                                <div class="w-full pr-2">
                                    <input type="number" id="day" name="day"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="DD"
										v-model="account.birthdate.day"
                                        >
                                </div>
								<div class="w-full px-2">
                                    <input type="number" id="month" name="month"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="MM"
										v-model="account.birthdate.month"
                                        >
                                </div>
								<div class="w-full pl-2">
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
                            <select class="w-1/2 py-3 mb-4 rounded-lg border-gray-400 text-gray-600 form-select" 
							name="country" id="country"
							v-model="account.user.address.country">
                                <option :value="''" >Select a Country</option>
                                <option v-for="country in countries" :key="country">{{ country }}</option>
                            </select>
                            <div class="flex flex-row ">
                                <div class="w-full pr-2 mb-4">
                                    <input type="text" id="street" name="street"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Street"
										v-model="account.user.address.street">
                                </div>
                                <div class="pl-2">
                                    <input type="text" id="number" name="number"
                                        class="border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Number"
										v-model="account.user.address.houseNumber">
                                </div>
                            </div>
                            <div class="flex flex-row ">
                                <div class="pr-2">
                                    <input type="text" id="zipcode" name="zipcode"
                                        class="border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Zip Code"
										v-model="account.user.address.zipCode">
                                </div>
                                 <div class="w-full pl-2">
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
                            These is Information specifically for a Lecturer
                        </label>
                    </div>
					<div class="w-full lg:w-2/3">
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Description</label>
                           <textarea name="description" id="description" cols="30" rows="5" class="w-full form-textarea border-2 border-gray-400 rounded-lg text-gray-600"
                                placeholder="Add an optional Description for the Lecturer (Publications, Awards ...)"
								v-model="account.lecturer.freeText">
                            </textarea>
                        </div>
                        <div class="mb-4 flex flex-col">
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
                            These are Information specifically for a Student
                        </label>
                    </div>
					<div class="w-full lg:w-2/3">
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Immatriculation Status</label>
                            <input type="text" id="immatriculationStatus" name="immatriculationStatus"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Immatriculation Status"
										v-model="account.student.immatriculationStatus">
                        </div>
                        <div class="mb-4 flex flex-col">
                           <input type="text" id="matriculationId" name="matriculationId"
                                        class="w-1/4 border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Matriculation-ID"
										v-model="account.student.matriculationId">
                        </div>
						<div class="mb-4 mt-8 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Study Status</label>
							<div class="flex flex-row ">
                                <div>
                                    <!-- v-for begins counting at 1, hence 1 is substracted for handling of the arrays -->
                                    <div class="w-full pr-2" v-for="index in selectedFieldsOfStudy+1" :key="index">
                                        <select class="w-full mb-4 py-3 rounded-lg border-gray-400 text-gray-600 form-select" 
                                        name="country" id="country" v-model="account.student.fieldsOfStudy[index-1]"
                                        >
                                        <option :value="undefined" @click="removeFieldOfStudy(index-1)">Select a Field of Study</option>
                                        <option v-for="field in fieldsOfStudyLists[index-1]" :key="field" @click="addFieldOfStudy(field,index-1)">{{ field }}</option>
                                        </select>
                                    </div>
                                </div>
								<div class="pl-2">
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
            <!-- This section is hidden for this moment, but will be used when editing accounts --> 
			<section class="border-t-2 py-8 border-gray-400 hidden">
				<div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Profile Picture</label>
                        <label class="block text-gray-600">
                            You May Change the Profile Picture
                        </label>
                    </div>
					<div class="flex flex-col items-center justify-center">
						<img class="object-contain h-48" :src="account.user.picture">
						<button class="bg-transparent hover:bg-blue-800 border-blue-700 border-2 text-blue-700 font-semibold hover:text-white py-2 px-4 border hover:border-transparent rounded-lg"
						@click="updatePicture">Upload Profile Picture</button>
					</div>
				</div>
			</section>
            <section class="border-t-2 py-8 border-gray-400 lg:mt-8 flex justify-end items-center">
                <button type="button" @click="navigateBack" class="w-32 mr-6 btn btn-blue-secondary">
                    Cancel
                </button>
                <button type="button" @click="createAccount" class="w-48 btn btn-blue-primary"
                v-bind:disabled="!hasInput">
                    Create Account
                </button>
            </section>
            <unsaved-changes-modal ref="unsavedChangesModal"/>
        </div>
    </div>
</template>

<script lang="ts">
import Router from "@/router/";
import {Role} from '@/entities/Role'
import { store } from '@/store/store';
import { ref, reactive, computed } from 'vue';
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
import UnsavedChangesModal from "@/components/modals/UnsavedChangesModal.vue";
import { Country } from '../../entities/Country';


export default {
    name: "AdminCreateAccountForm",
    components: {
        UnsavedChangesModal,
    },
    props: {
        editMode: {
            type: Boolean,
            required: true
        }
    },
    setup() {
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
        let selectedFieldsOfStudy = ref(0);
        let success = ref(new Boolean());
        success.value = false;
		let roles = Object.values(Role).filter(e => e!=Role.NONE);
        let fieldsOfStudy = Object.values(FieldOfStudy);
        let fieldsOfStudyLists:FieldOfStudy[][] = reactive([fieldsOfStudy]);
        let countries = Object.values(Country).filter(e => e!= Country.NONE);
        let unsavedChangesModal = ref();
		
		
		let isLecturer = computed(() => {
			return account.user.role === Role.LECTURER;
		})

		let isStudent = computed(() => {
			return account.user.role === Role.STUDENT;
		})

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
            //TODO
			console.log(account)
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
		
        let hasInput = computed(() => {
			if(	account.user.role != Role.NONE || account.user.username != "" || account.user.email != "" || account.authUser.password != "" ||
				account.user.firstName != "" || account.user.lastName != "" || account.birthdate.day != "" || account.birthdate.month != "" || 
				account.birthdate.year != "" || account.user.address.country != "" || account.user.address.street != "" ||
				account.user.address.houseNumber != "" || account.user.address.zipCode != "" || account.user.address.city != "") {
                return true;
			}
			// No need to check the Lecturer's and Student's Forms at this point, as hasInput will already be true when the role
			// was set
            return false;
        })
		
        function navigateBack() {
            Router.back();
        }
		
        function createAccount() {
             if(isValid()) {    
                const userManagement: UserManagement = new UserManagement();
                account.authUser.username = account.user.username;
                account.authUser.role = account.user.role;
                account.user.birthdate = account.birthdate.year + "-" + account.birthdate.month + "-" + account.birthdate.day;
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

                userManagement.createUser(account.authUser, newUser)
                .then( (value) => {
                    if(value) {
                        success.value = true;
                        navigateBack();
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
            navigateBack,
            createAccount,
            unsavedChangesModal,
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
