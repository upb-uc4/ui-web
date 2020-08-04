import User from "@/api/api_models/user_management/User";
import Student from "@/api/api_models/user_management/Student";
import { Role } from "@/entities/Role";
import { Account } from "@/entities/Account";
import Address from "@/api/api_models/user_management/Address";
import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";
import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";

export var authUser: Account = {
    username: "testUser",
    password: "testUser",
    role: Role.STUDENT,
};

export var address: Address = {
    street: "Sandy Street",
    houseNumber: "5c",
    zipCode: "42069",
    city: "Mos Eisley",
    country: "Germany",
};

export var user: User = {
    username: "testUser",
    role: Role.STUDENT,
    address: address,
    firstName: "Luke",
    lastName: "Skywalker",
    picture: "string",
    email: "luke@skywalker.com",
    birthDate: "1950-12-24",
};

export var student: Student = {
    ...user,
    latestImmatriculation: "",
    matriculationId: "2187",
};
