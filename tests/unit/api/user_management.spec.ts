import User_Management from "@/api/User_Management"
import { Role } from '@/entities/Role'
import { Account } from '@/entities/Account';
import Student from '@/api/api_models/user_management/Student';
import Address from '@/api/api_models/user_management/Address';
import User from '@/api/api_models/user_management/User';
import { FieldOfStudy } from '@/api/api_models/user_management/FieldOfStudy';

var user_management : User_Management;
const adminAuth = {username: "admin", password: "admin"};
jest.setTimeout(30000);

beforeAll(async () => {
    // authentication_management = new Authentication_Management();
    // await authentication_management.login(lecturerAuth);
    user_management = new User_Management();
    await user_management.login(adminAuth);
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

test("Get specific user", async () => {
    await new Promise((r) => setTimeout(r, 10000));
    var result = false;
    const user = await user_management.getSpecificUser(student.username);
    result = (user.firstName == student.firstName);
    expect(result).toBe(true)  
})

test("Get all users", async () => {
    const users = await user_management.getAllUsers();
    let result = true;
    result = result && users.students.length > 0
    expect(result).toBe(true)
})

test("Get all students", async () => {
    const users = await user_management.getAllUsersByRole(Role.STUDENT);
    let result = users.length > 0
    expect(result).toBe(true)   
})

test("Update user", async () => {
    await new Promise((r) => setTimeout(r, 5000));
    student.immatriculationStatus = "Is a Jedi Master";
    const success = await user_management.updateUser(student);
    expect(success).toBe(true);
})

test("Delete user", async () => {
    await new Promise((r) => setTimeout(r, 5000));
    const success = await user_management.deleteUser(student.username)
    expect(success).toBe(true);
})