import { Component } from '@angular/core';

export type Credentials = {
  email: string,
  password: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public credentials: Credentials = {
    email: '',
    password: ''
  }

  public login(): void {
    console.log(this.credentials);
  }
}
