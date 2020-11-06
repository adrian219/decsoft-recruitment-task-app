import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import { map } from 'rxjs/operators';
import {environment} from '../../environments/environment';

export class JwtRequest {
  username: string;
  password: string;
}

export class JwtResponse {
  token: string;
}

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient,
              private router: Router) {
  }

  login(username: string, password: string): any {
    return this.http.post<JwtResponse>(`${environment.apiUrl}/authentication/token`, {username, password})
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
        }

        return user;
      }));
  }

  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
