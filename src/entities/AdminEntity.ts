import { Role } from './Role';
import AddressEntity from './AddressEntity';
import Address from '@/api/api_models/user_management/Address';
import Admin from '@/api/api_models/user_management/Admin';

export default class AdminEntity implements Admin {
    username = "";
    role = Role.ADMIN;
    address : Address = new AddressEntity();
    firstName = "";
    lastName = "";
    picture = "";
    email = "";
    birthdate = "";

    constructor(example: boolean) {
        if (example) {
            this.username = "yoda";

            this.address.city = "Coruscant"
            this.address.country = "SomePlanet"
            this.address.houseNumber = "5b"
            this.address.street = "Jedi Temple"
            this.address.zipCode = "12345"

            this.firstName = "Master"
            this.lastName = "Yoda"
            this.picture = "https://cdn0.iconfinder.com/data/icons/star-wars/48/yoda-512.png"
            this.email = "greenHobo@secretlysiths.edu"
            this.birthdate = "0000-01-01"
        }
    }
}