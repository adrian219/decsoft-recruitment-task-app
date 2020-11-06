import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AddressBookDto} from '../../model/address-book.dto';
import {CreateAddressBookDto} from '../../model/create-address-book.dto';
import {EditAddressBookDto} from '../../model/edit-address-book.dto';
import {Observable} from 'rxjs';

export interface AddressBookPage {
  totalElements: number;
  content: AddressBookDto[];
}

@Injectable({
  providedIn: 'root'
})
export class AddressBookService {
  private serviceUrl = environment.apiUrl + '/address-books';

  constructor(private http: HttpClient) {
  }

  list(page: number, size: number, q ?: string): Observable<HttpResponse<AddressBookPage>> {
    let param;

    param = {
      page: page.toString(),
      size: size.toString()
    };

    if (q) {
      param = {
        query: q,
        page: page.toString(),
        size: size.toString()
      };
    }

    return this.http.get<AddressBookPage>(this.serviceUrl, {
      params: param,
      observe: 'response'
    });
  }

  get(id: number): Observable<AddressBookDto> {
    return this.http.get<AddressBookDto>(this.serviceUrl + `/${id}`);
  }

  create(dto: CreateAddressBookDto, file ?: File): Observable<AddressBookDto> {
    const data: FormData = new FormData();
    if (file !== null && file !== undefined) {
      data.append('file', file);
    }
    data.append('dto', JSON.stringify(dto));

    return this.http.post<AddressBookDto>(this.serviceUrl, data);
  }

  edit(id: number, dto: EditAddressBookDto, file ?: File): Observable<AddressBookDto> {
    const data: FormData = new FormData();
    if (file !== null && file !== undefined) {
      data.append('file', file);
    }
    data.append('dto', JSON.stringify(dto));

    return this.http.put<AddressBookDto>(this.serviceUrl + `/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.serviceUrl + `/${id}`);
  }
}
