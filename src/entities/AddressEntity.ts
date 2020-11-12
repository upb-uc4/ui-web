import Address from "@/api/api_models/user_management/Address";
import { Country } from "./Country";

export default class AddressEntity implements Address {
    street: string = "";
    houseNumber: string = "";
    zipCode: string = "";
    city: string = "";
    country = Country.NONE;
}
