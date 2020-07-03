import { Country } from './Country';
import Address from '@/api/api_models/user_management/Address';

export default class AddressEntity implements Address {
    street: string = "";
    houseNumber: string = "";
    zipCode: string = "";
    city: string = "";
    country = Country.NONE;
}