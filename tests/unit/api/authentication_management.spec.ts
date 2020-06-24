import Authentication_Management from "@/api/Authentication_Management"
import { Role } from '@/entities/Role'
import { Account } from '@/entities/Account';

const authentication_management = new Authentication_Management();
const adminAuth = {username: "admin", password: "admin"};
const studentAuth = {username: "student", password: "student"};
const lecturerAuth = {username: "lecturer", password: "lecturer"};

test("Logins", async () => {
    const list = [adminAuth, studentAuth, lecturerAuth];
    for (let auth of list) {
        const success = await authentication_management.login(auth);
        expect(success).toBe(true);
    }
})

test("Get role of admin", async () => {
    await authentication_management.login(adminAuth);
    const role = await authentication_management.getRole("admin");
    expect(role).toBe(Role.ADMIN);
})

test("Get own role", async () => {
    await authentication_management.login(adminAuth);
    const role = await authentication_management.getOwnRole();
    expect(role).toBe(Role.ADMIN);    
})

const newAccount = new Account();
newAccount.username = "TestAccount"
newAccount.password = "superPassword"
newAccount.role = Role.ADMIN

test("Create Account", async () => {
    await authentication_management.login(adminAuth);
    const success = await authentication_management.createAccount(newAccount);
    expect(success).toBe(true)
})

test("Delete Account", async () => {
    await authentication_management.login(adminAuth);
    const success = await authentication_management.deleteAccount(newAccount.username);
    expect(success).toBe(true)
})