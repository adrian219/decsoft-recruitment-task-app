import {PhoneDto} from './phone.dto';

export class AddressBookDto {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phones?: PhoneDto[];
  photoId?: number;
}
