import {PhoneDto} from './phone.dto';

export class CreateAddressBookDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phones?: PhoneDto[];
}
