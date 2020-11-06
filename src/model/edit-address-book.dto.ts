import {PhoneDto} from './phone.dto';

export class EditAddressBookDto {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phones?: PhoneDto[];
  photoId?: number;
}
