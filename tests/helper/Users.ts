import { Role } from "@/entities/Role";
import Student from "@/api/api_models/user_management/Student";
import Admin from "@/api/api_models/user_management/Admin";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import fs from "fs";
import { Account } from "@/entities/Account";

export function getRandomizedUser(role: Role): Student | Admin | Lecturer {
    const random = Math.floor(Math.random() * 9999);
    const admin = JSON.parse(fs.readFileSync("tests/fixtures/admin.json", "utf-8")) as Admin;
    const student = JSON.parse(fs.readFileSync("tests/fixtures/student.json", "utf-8")) as Student;
    const lecturer = JSON.parse(fs.readFileSync("tests/fixtures/lecturer.json", "utf-8")) as Lecturer;

    switch (role) {
        case Role.ADMIN:
            admin.username = admin.username + random;
            return admin;
        case Role.STUDENT:
            student.username = student.username + random;
            var today = new Date();
            var monthPadded = ("00" + (today.getMonth() + 1)).substr(-2);
            var dayPadded = ("00" + today.getDate()).substr(-2);
            var random2 = Math.floor(Math.random() * 999).toString();
            var randomPadded = ("000" + random2).substr(-3);
            student.matriculationId = monthPadded + dayPadded + randomPadded;
            return student;
        case Role.LECTURER:
            lecturer.username = lecturer.username + random;
            return lecturer;
        default:
            return {} as Admin;
    }
}

export function getRandomizedUserAndAuthUser(
    role: Role
):
    | { governmentId: string; student: Student; authUser: Account }
    | { governmentId: string; lecturer: Lecturer; authUser: Account }
    | { governmentId: string; admin: Admin; authUser: Account } {
    const authUser: Account = JSON.parse(
        fs.readFileSync(`tests/fixtures/${role[0].toLowerCase() + role.substring(1) + "AuthUser.json"}`, "utf-8")
    );
    const user = getRandomizedUser(role);
    const governmentId = getRandomizedGovernmentId();
    authUser.username = user.username;

    switch (role) {
        case Role.ADMIN:
            return { governmentId, admin: user as Admin, authUser: authUser };
        case Role.STUDENT:
            return { governmentId, student: user as Student, authUser: authUser };
        case Role.LECTURER:
            return { governmentId, lecturer: user as Lecturer, authUser: authUser };
        default:
            return {} as { governmentId: string; admin: Admin; authUser: Account };
    }
}

export function getRandomizedGovernmentId(): string {
    return new Date().toISOString();
}
