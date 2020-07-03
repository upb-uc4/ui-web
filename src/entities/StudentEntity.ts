import Student from "@/api/api_models/user_management/Student"
import { Role } from './Role';
import AddressEntity from './AddressEntity';
import Address from '@/api/api_models/user_management/Address';
import { FieldOfStudy } from '@/api/api_models/user_management/FieldOfStudy';

export default class StudentEntity implements Student {
    immatriculationStatus = "";
    matriculationId = "";
    semesterCount = -1;
    fieldsOfStudy: FieldOfStudy[] = [];
    username = "";
    role = Role.STUDENT;
    address : Address = new AddressEntity();
    firstName = "";
    lastName = "";
    picture = "";
    email = "";
    birthdate = "";

    constructor(example: boolean) {
        if (example) {
            this.username = "vader";

            this.address.city = "Sithcy"
            this.address.country = "Mustafar"
            this.address.houseNumber = "3"
            this.address.street = "Awesome Base"
            this.address.zipCode = "1358"

            this.firstName = "Darth"
            this.lastName = "Vader"
            this.picture = "https://cdn0.iconfinder.com/data/icons/star-wars/512/darth_vader-512.png"
            this.email = "ihatesand@sithsrule.com"
            this.birthdate = "0222-07-31"

            this.fieldsOfStudy = [FieldOfStudy.EDUCATION]
            this.matriculationId = "420"
            this.semesterCount = 5
        }
    }
}