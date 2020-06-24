import User_Management from "@/api/User_Management"
import { Role } from '@/entities/Role'
import { Account } from '@/entities/Account';
import Authentication_Management from "@/api/Authentication_Management"
import { Course } from '@/entities/Course';
import { Language } from '@/entities/Language';
import { CourseType } from '@/entities/CourseType';
import Student from '@/api/api_models/user_management/Student';
import Address from '@/api/api_models/user_management/Address';
import User from '@/api/api_models/user_management/User';
import { FieldOfStudy } from '@/api/api_models/user_management/FieldOfStudy';


var authentication_management: Authentication_Management;
var user_management : User_Management;
const adminAuth = {username: "admin", password: "admin"};
const studentAuth = {username: "student", password: "student"};
const lecturerAuth = {username: "lecturer", password: "lecturer"};


beforeAll(async () => {
    authentication_management = new Authentication_Management();
    await authentication_management.login(lecturerAuth);
    user_management = new User_Management();
})

test("Get all users", async () => {
    setTimeout(async () => {
        const users = await user_management.getAllUsers();
        var result = true;
        result = result && users.admins.filter((admin) => admin.username === "admin").length == 1
        result = result && users.students.filter((student) => student.username === "student").length == 1
        result = result && users.lecturers.filter((lecturer) => lecturer.username === "lecturer").length == 1
        expect(result).toBe(true)
    }, 10000)
})

test("Get all students", async () => {
    setTimeout(async () => {
        const users = await user_management.getAllUsersByRole(Role.STUDENT);
        var result = users.filter((student) => student.username === "student").length == 1
        expect(result).toBe(true)
    }, 10000)    
})

test("Get all lecturers", async () => {
    setTimeout(async () => {
        const users = await user_management.getAllUsersByRole(Role.LECTURER);
        var result = users.filter((admin) => admin.username === "admin").length == 1
        expect(result).toBe(true)
    }, 10000)    
})

test("Get all admins", async () => {
    setTimeout(async () => {
        const users = await user_management.getAllUsersByRole(Role.ADMIN);
        var result = users.filter((lecturer) => lecturer.username === "lecturer").length == 1
        expect(result).toBe(true)
    }, 10000)    
})

test("Get specific user", async () => {
    setTimeout(async () => {
        const user = await user_management.getSpecificUser("student");
        var result = user.username == "student";
        expect(result).toBe(true)
    }, 10000)    
})

var authUser: Account = {
    username: "testUser",
    password: "testUser",
    role: Role.STUDENT
}

var address: Address = {
    street: "Sandy Street",
    houseNumber: "5C",
    zipCode: "42069",
    city: "Mos Eisley",
    country: "Tatooine"
}

var user: User = {
    username: "testUser",
    role: Role.STUDENT,
    address: address,
    firstName: "Luke",
    lastName: "Skywalker",
    picture: "string",
    email: "luke@skywalker.com",
    birthdate: "1950-12-24"
}

var student: Student = {
    ...user,
    immatriculationStatus: "Is still a Jedi Knight",
    matriculationId: "FN-2187",
    semesterCount: 69,
    fieldsOfStudy: [
        FieldOfStudy.COMPUTER_SCIENCE,
        FieldOfStudy.MATHEMATICS
    ]  
}

test("Create user", async () => {
    const success = await user_management.createUser(authUser, student);
    expect(success).toBe(true);
})

test("Update user", async () => {
    student.immatriculationStatus = "Is a Jedi Master"
    const success = await user_management.updateUser(student)
})


test("Delete user", async () => {
    setTimeout(async () => {
        const success = await user_management.deleteUser("testUser")
        expect(success).toBe(true);
    }, 10000)
})