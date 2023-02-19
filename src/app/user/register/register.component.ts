import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  /* ------------------------------ Form Controls ----------------------------- */
  public name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  public email = new FormControl('', [Validators.required]);
  public age = new FormControl('', [Validators.required]);
  public password = new FormControl('', [Validators.required]);
  public confirm_password = new FormControl('', [Validators.required]);
  public phoneNumber = new FormControl('', [Validators.required]);


  public registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber
  });
}
