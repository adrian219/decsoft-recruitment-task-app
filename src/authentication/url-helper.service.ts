import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UrlHelperService {
  constructor(private http: HttpClient) {
  }

  get(url: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let objectUrl: string = null;

      this.http
        .get(url, {
          headers: this.getHeaders(),
          responseType: 'blob'
        })
        .subscribe(m => {
          objectUrl = URL.createObjectURL(m);
          observer.next(objectUrl);
        });

      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
      };
    });
  }

  getHeaders(): HttpHeaders {
    const headers = new HttpHeaders();

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      headers.set('Authorization', 'Bearer ' + currentUser.token);
    }

    return headers;
  }
}
