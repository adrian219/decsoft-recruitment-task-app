import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AuthenticationService, JwtRequest} from './authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: JwtRequest = {username: '', password: ''};

  loading = false;
  submitted = false;
  returnUrl: string;
  hide = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(loginForm: NgForm): void {
    this.submitted = true;

    // stop here if form is invalid
    if (loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .pipe(first())
      .subscribe(
        () => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          console.log(error);
          if (error === 'INVALID_CREDENTIALS') {
            alert('Nieprawidłowe dane logowania!');
          } else {
            alert('Spróbuj jeszcze raz!');
          }
          this.loading = false;
        });
  }
}
