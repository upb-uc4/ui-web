<template>

    <div class="w-full lg:mt-20 mt-8 bg-gray-300 mx-auto h-screen">
        <button @click="navigateBack()" class="flex items-center mb-4 navigation-link">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Back</span>
        </button>

        <h1 class="text-2xl font-medium text-gray-700 mb-8">Account Creation</h1>

        <form @submit.prevent="submit" method="POST">
            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Select a Role</label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="mb-4 flex">
                             <div class="mr-4 mb-3" v-for="role in roles" :key="role">
                                <label class="flex items-center" >
                                    <input type="radio" class="form-radio radio" name="role" :value="role" v-model="account.role">
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
                                v-model="account.username">
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Email</label>
                            <input type="text" id="email" name="email"
                                class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                placeholder="Email"
								v-model="account.email"
                                >
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label for="password" class="text-gray-700 text-md font-medium mb-3">
                                Password
                            </label>
                            <input type="text" id="password" name="password"
                                class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                placeholder="Password"
                                v-model="account.password">
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
										v-model="account.firstName"
                                        >
                                </div>
                                <div class="w-full pl-2">
                                    <input type="text" id="lastName" name="lastName"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Lastname"
										v-model="account.lastName"
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
                                        placeholder="Day"
										v-model="account.birthdate.day"
                                        >
                                </div>
								<div class="w-full px-2">
                                    <input type="number" id="month" name="month"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Month"
										v-model="account.birthdate.month"
                                        >
                                </div>
								<div class="w-full pl-2">
                                    <input type="number" id="year" name="year"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Year"
										v-model="account.birthdate.year"
                                        >
                                </div>
                            </div>
                        </div>
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">
                                Adress 
                            </label>
                            <select class="w-1/2 py-3 mb-4 rounded-lg border-gray-400 text-gray-600 form-input" 
							name="country" id="country"
							v-model="account.address.country">
                                <!-- TODO: create Options via country enum -->
                                <option value="Germany">Germany</option>
                                <option value="United States">United States</option>
								<option value="Country">Country</option>
                            </select>
                            <div class="flex flex-row ">
                                <div class="w-full pr-2 mb-4">
                                    <input type="text" id="street" name="street"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Street"
										v-model="account.address.street">
                                </div>
                                <div class="pl-2">
                                    <input type="number" id="number" name="number"
                                        class="border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Number"
										v-model="account.address.houseNumber">
                                </div>
                            </div>
                            <div class="flex flex-row ">
                                <div class="pr-2">
                                    <input type="number" id="zipcode" name="zipcode"
                                        class="border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Zip Code"
										v-model="account.address.zipCode">
                                </div>
                                 <div class="w-full pl-2">
                                    <input type="text" id="city" name="city"
                                        class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="City"
										v-model="account.address.city">
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
                            These are Information specifically for a Lecturer
                        </label>
                    </div>
					<div class="w-full lg:w-2/3">
                        <div class="mb-4 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Description</label>
                           <textarea name="description" id="description" cols="30" rows="5" class="w-full form-textarea border-2 border-gray-400 rounded-lg text-gray-600"
                                placeholder="Add an optional Description for the Lecturer (Publications, Awards ...)"
								v-model="account.lecturerInfo.freeText">
                            </textarea>
                        </div>
                        <div class="mb-4 flex flex-col">
                           <textarea name="researchField" id="researchField" cols="30" rows="3" class="w-full form-textarea border-2 border-gray-400 rounded-lg text-gray-600"
                                placeholder="Add an optional Description of the Lecturer's Fields of Research"
								v-model="account.lecturerInfo.researchArea">>
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
										v-model="account.studentInfo.immatriculationStatus">
                        </div>
                        <div class="mb-4 flex flex-col">
                           <input type="number" id="matriculationId" name="matriculationId"
                                        class="w-1/4 border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Matriculation-ID"
										v-model="account.studentInfo.matriculationId">
                        </div>
						<div class="mb-4 mt-8 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Study Status</label>
							<div class="flex flex-row ">
                                 <div class="w-full pr-2">
                                    <select class="w-full mb-4 py-3 rounded-lg border-gray-400 text-gray-600 form-input" 
									name="country" id="country"
									v-model="account.studentInfo.fieldsOfStudy">
									<!-- TODO: create Options via country enum -->
									<option v-for="field in fieldsOfStudyList" :key="field">{{ field }}</option>
									</select>
                                </div>
								<div class="pl-2">
                                    <input type="number" id="semesterCount" name="semesterCount"
                                        class="border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input"
                                        placeholder="Semester Count"
										v-model="account.studentInfo.semesterCount">
                                </div>
                            </div>
                        </div>
                    </div>
				</div>
			</section>
			<section class="border-t-2 py-8 border-gray-400">
				<div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Profile Picture</label>
                        <label class="block text-gray-600">
                            You May Change the Profile Picture
                        </label>
                    </div>
					<div class="flex flex-col items-center justify-center">
						<img class="object-contain h-48" src="@/assets/blank_profile_picture.png">
						<button class="bg-transparent hover:bg-blue-800 border-blue-700 border-2 text-blue-700 font-semibold hover:text-white py-2 px-4 border hover:border-transparent rounded-lg"
						@click="updatePicture">Upload Profile Picture</button>
					</div>
				</div>
			</section>
            <section class="border-t-2 py-8 border-gray-400 lg:mt-8 flex justify-end items-center">
                <button type="button" @click="navigateBack" class="w-32 mr-6 btn btn-blue-secondary">
                    Cancel
                </button>
                <button type="submit" class="w-48 btn btn-blue-primary"
                v-bind:disabled="!hasInput">
                    Create Account
                </button>
            </section>
        </form>

    </div>
</template>

<script lang="ts">
import Router from "@/router/";
import {Account} from '@/entities/Account'
import {Role} from '@/entities/Role'
import { store } from '@/store/store';
import Authentication_Management from "@/api/Authentication_Management"
import { computed, reactive } from 'vue';
import  Address  from '@/api/api_models/user_management/Address'
import {FieldOfStudy} from '@/api/api_models/user_management/FieldOfStudy'

export default {
    name: "AdminCreateAccountForm",
    props: {

    },
    setup() {
        let account = reactive( {
			role: Role.NONE,
			username: "",
			email: "",
			password: "",
			firstName: "",
			lastName: "",
			birthdate: {
				day: "",
				month: "",
				year: "",
			},
			address: {
				country: "Country",
				street: "",
				houseNumber: "",
				zipCode: "",
				city: "",
			},
			picture: "",
			lecturerInfo: {
				freeText: "",
				researchArea: "",
			},
			studentInfo: {
				immatriculationStatus: "",
				matriculationId: "",
				fieldsOfStudy: FieldOfStudy.COMPUTER_SCIENCE,
				semesterCount: "",
			}
		})
        let success:boolean = false;
		let roles = Object.values(Role).filter(e => e!=Role.NONE);
		let fieldsOfStudyList = Object.values(FieldOfStudy);
		
		
		let isLecturer = computed(() => {
			return account.role === Role.LECTURER;
		})

		let isStudent = computed(() => {
			return account.role === Role.STUDENT;
		})

		function updatePicture() {
			console.log(account)
			console.log(hasInput)
		}

		/*
        function isValid() {
            if(account.value.username == "" || account.value.password =="" || account.value.role == Role.NONE) {
                return false;
            }
            return true;
        }
		*/
        let hasInput = computed(() => {
			if(	account.role != Role.NONE || account.username != "" || account.email != "" || account.password != "" ||
				account.firstName != "" || account.lastName != "" || account.birthdate.day != "" || account.birthdate.month != "" || 
				account.birthdate.year != "" || account.address.country != "Country" || account.address.street != "" ||
				account.address.houseNumber != "" || account.address.zipCode != "" || account.address.city != "") {
                return true;
			}
			// No need to check the Lecturer's and Student's Forms at this point, as hasInput will already be true when the role
			// was set
            return false;
        })
		/*
        function navigateBack() {
            Router.go(-1);
        }

        function submit() {
             if(isValid()) {    
                const authentication_management: Authentication_Management = new Authentication_Management();
                authentication_management.createAccount(account.value).then(() =>{
                    //handle errors, ...
                })
            }
            else {
                success = false;
            }
        }*/

        return {
            account,
            success,
			roles,
			updatePicture,
			isLecturer,
			isStudent,
			fieldsOfStudyList,
			hasInput,
            // isValid,
            // navigateBack,
            
            // submit
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
        //todo use styled modal
        //todo break this into smaller methods
        if (this.success) {
            return next();
        }
        else if (this.hasInput) {
            const answer = window.confirm('Do you really want to leave? You have unsaved changes!')
            if (answer) {
                return next()
            } else {
                return next(false)
            }
        }
        else {
            return next()
        }
    }
};
</script>
