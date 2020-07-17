import Lecturer from "@/api/api_models/user_management/Lecturer";
import { Role } from "./Role";
import AddressEntity from "./AddressEntity";
import Address from "@/api/api_models/user_management/Address";

export default class LecturerEntity implements Lecturer {
    freeText = "";
    researchArea = "";
    username = "";
    role = Role.LECTURER;
    address: Address = new AddressEntity();
    firstName = "";
    lastName = "";
    picture = "";
    email = "";
    birthDate = "";

    constructor(example: boolean) {
        if (example) {
            this.username = "palpatine";

            this.address.city = "Creepy City";
            this.address.country = "Exegol";
            this.address.houseNumber = "666";
            this.address.street = "Sith Temple";
            this.address.zipCode = "666";

            this.firstName = "The";
            this.lastName = "Senate";
            this.picture = "https://cdn3.iconfinder.com/data/icons/star-wars-color/216/emperor-palpatine-512.png";
            this.email = "gooooood@anakin.goood";
            this.birthDate = "4200-05-03";

            this.freeText = "Did you ever hear the tragedy of Darth Plaguies the wise?";
            this.researchArea = "Many abilities some consider to be unnatural";
        }
    }
}
